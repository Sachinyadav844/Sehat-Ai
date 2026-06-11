import { MemoryProvider } from "../interfaces/memory-provider.interface";
import { InMemoryProvider } from "../providers/in-memory.provider";
import { MemoryHealthReport, MemoryKey } from "../types/memory.types";
import { logger } from "../../utils/logger";

export class MemoryService<T = unknown> {
  private provider: MemoryProvider<T>;
  private readonly fallbackProvider: MemoryProvider<T>;
  private readonly ready: Promise<void>;

  constructor(provider: MemoryProvider<T>) {
    this.provider = provider;
    this.fallbackProvider = provider.providerName === "in-memory" ? provider : new InMemoryProvider<T>();
    this.ready = this.initialize();
  }

  public async get(key: MemoryKey): Promise<T | null> {
    return this.execute((provider) => provider.get(key), "get");
  }

  public async set(key: MemoryKey, value: T, ttlSeconds?: number): Promise<boolean> {
    return this.execute((provider) => provider.set(key, value, ttlSeconds), "set");
  }

  public async delete(key: MemoryKey): Promise<boolean> {
    return this.execute((provider) => provider.delete(key), "delete");
  }

  public async exists(key: MemoryKey): Promise<boolean> {
    return this.execute((provider) => provider.exists(key), "exists");
  }

  public async expire(key: MemoryKey, ttlSeconds: number): Promise<boolean> {
    return this.execute((provider) => provider.expire(key, ttlSeconds), "expire");
  }

  public async clear(): Promise<void> {
    return this.execute((provider) => provider.clear(), "clear");
  }

  public async healthCheck(): Promise<MemoryHealthReport> {
    await this.ready;
    try {
      const health = await this.provider.healthCheck();
      if (health.status !== "healthy" && this.provider.providerName === "redis") {
        this.activateFallback(health.details);
        return this.fallbackProvider.healthCheck();
      }
      return health;
    } catch (error) {
      this.activateFallback((error as Error).message);
      return this.fallbackProvider.healthCheck();
    }
  }

  private async initialize(): Promise<void> {
    if (this.provider.providerName !== "redis") {
      return;
    }

    try {
      const health = await this.provider.healthCheck();
      if (health.status !== "healthy") {
        this.activateFallback(health.details);
      } else {
        logger.info("memory.provider.connected", { provider: this.provider.providerName });
      }
    } catch (error) {
      this.activateFallback((error as Error).message);
    }
  }

  private async execute<R>(operation: (provider: MemoryProvider<T>) => Promise<R>, operationName: string): Promise<R> {
    await this.ready;
    try {
      return await operation(this.provider);
    } catch (error) {
      logger.error("memory.operation.failed", {
        operation: operationName,
        provider: this.provider.providerName,
        message: (error as Error).message,
      });

      if (this.provider.providerName === "redis") {
        this.activateFallback((error as Error).message);
        return operation(this.provider);
      }

      throw error;
    }
  }

  private activateFallback(details?: string): void {
    if (this.provider.providerName === "in-memory") {
      return;
    }

    logger.warn("memory.fallback.activated", {
      failedProvider: this.provider.providerName,
      fallbackProvider: this.fallbackProvider.providerName,
      details,
    });
    this.provider = this.fallbackProvider;
  }
}
