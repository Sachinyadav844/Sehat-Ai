import Redis, { RedisOptions } from "ioredis";
import { MemoryProvider } from "../interfaces/memory-provider.interface";
import { MemoryHealthReport, MemoryKey, MemoryProviderError, MemoryValidationError } from "../types/memory.types";
import { logger } from "../../utils/logger";

export interface RedisProviderOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  connectTimeoutMs?: number;
}

export class RedisProvider<T = unknown> implements MemoryProvider<T> {
  public readonly providerName = "redis" as const;
  private client: Redis | null = null;
  private readonly host: string;
  private readonly port: number;
  private readonly password?: string;
  private readonly db: number;
  private readonly keyPrefix: string;
  private readonly connectTimeoutMs: number;

  constructor(options: RedisProviderOptions) {
    this.host = options.host ?? "localhost";
    this.port = options.port ?? 6379;
    this.password = options.password;
    this.db = options.db ?? 0;
    this.keyPrefix = options.keyPrefix ?? "sehatai:";
    this.connectTimeoutMs = options.connectTimeoutMs ?? 10000;
  }

  public async get(key: MemoryKey): Promise<T | null> {
    this.validateKey(key);
    const client = await this.getClient();
    const raw = await client.get(this.prefixKey(key));
    if (raw === null) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      logger.error("memory.redis.serialization.error", {
        provider: this.providerName,
        key,
        error: (error as Error).message,
      });
      await this.delete(key);
      return null;
    }
  }

  public async set(key: MemoryKey, value: T, ttlSeconds?: number): Promise<boolean> {
    this.validateKey(key);
    const bytes = this.serialize(value);
    const client = await this.getClient();
    if (ttlSeconds && ttlSeconds > 0) {
      await client.set(this.prefixKey(key), bytes, "EX", ttlSeconds);
    } else {
      await client.set(this.prefixKey(key), bytes);
    }
    return true;
  }

  public async delete(key: MemoryKey): Promise<boolean> {
    this.validateKey(key);
    const client = await this.getClient();
    const removed = await client.del(this.prefixKey(key));
    return removed > 0;
  }

  public async exists(key: MemoryKey): Promise<boolean> {
    this.validateKey(key);
    const client = await this.getClient();
    const result = await client.exists(this.prefixKey(key));
    return result === 1;
  }

  public async expire(key: MemoryKey, ttlSeconds: number): Promise<boolean> {
    this.validateKey(key);
    if (ttlSeconds <= 0) {
      throw new MemoryValidationError("TTL must be greater than zero");
    }
    const client = await this.getClient();
    const success = await client.expire(this.prefixKey(key), ttlSeconds);
    return success === 1;
  }

  public async clear(): Promise<void> {
    const client = await this.getClient();
    const keysToDelete: string[] = [];

    const stream = client.scanStream({ match: `${this.keyPrefix}*`, count: 100 });
    for await (const batch of stream) {
      const batchKeys = batch as string[];
      keysToDelete.push(...batchKeys);
    }

    if (keysToDelete.length > 0) {
      await client.del(...keysToDelete);
    }
  }

  public async healthCheck(): Promise<MemoryHealthReport> {
    try {
      const client = await this.getClient();
      const response = await client.ping();
      const healthy = response === "PONG";
      if (!healthy) {
        throw new Error(`Unexpected redis ping response: ${response}`);
      }
      return { provider: this.providerName, status: "healthy" };
    } catch (error) {
      const message = (error as Error).message || "Redis health check failed";
      logger.error("memory.redis.healthcheck.failed", {
        provider: this.providerName,
        message,
      });
      return { provider: this.providerName, status: "unhealthy", details: message };
    }
  }

  private async getClient(): Promise<Redis> {
    if (this.client?.status === "ready") {
      return this.client;
    }

    if (this.client && this.client.status === "connecting") {
      await this.waitForReady();
      return this.client;
    }

    const options: RedisOptions = {
      host: this.host,
      port: this.port,
      password: this.password,
      db: this.db,
      connectTimeout: this.connectTimeoutMs,
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
    };

    this.client = new Redis(options);
    try {
      await this.client.connect();
      return this.client;
    } catch (error) {
      const message = (error as Error).message || "Redis connection failed";
      logger.error("memory.redis.connection.failed", {
        provider: this.providerName,
        host: this.host,
        port: this.port,
        message,
      });
      this.disconnectClient();
      throw new MemoryProviderError(message);
    }
  }

  private async waitForReady(): Promise<void> {
    if (!this.client) {
      return;
    }

    return new Promise((resolve, reject) => {
      const client = this.client!;
      const timeout = setTimeout(() => {
        reject(new MemoryProviderError("Redis connection timeout"));
      }, this.connectTimeoutMs);

      client.once("ready", () => {
        clearTimeout(timeout);
        resolve();
      });

      client.once("error", (error: Error) => {
        clearTimeout(timeout);
        reject(new MemoryProviderError(error.message));
      });
    });
  }

  private prefixKey(key: MemoryKey): string {
    return `${this.keyPrefix}${key}`;
  }

  private serialize(value: T): string {
    try {
      const payload = JSON.stringify(value);
      if (payload === undefined) {
        throw new MemoryValidationError("Memory payload must be serializable JSON");
      }
      return payload;
    } catch (error) {
      throw new MemoryValidationError("Memory payload must be serializable JSON");
    }
  }

  private validateKey(key: MemoryKey): void {
    if (!key || typeof key !== "string" || !key.trim()) {
      throw new MemoryValidationError("Memory key must be a non-empty string");
    }
  }

  private disconnectClient(): void {
    if (this.client) {
      try {
        this.client.disconnect();
      } catch {
        // ignore disconnect errors
      }
      this.client = null;
    }
  }
}
