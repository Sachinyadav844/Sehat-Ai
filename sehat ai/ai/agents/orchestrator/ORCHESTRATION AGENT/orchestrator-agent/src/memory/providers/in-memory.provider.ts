import { MemoryProvider } from "../interfaces/memory-provider.interface";
import { MemoryHealthReport, MemoryKey, MemoryMetadata, MemoryValidationError } from "../types/memory.types";
import { IN_MEMORY_CLEANUP_INTERVAL_MS, MAX_MEMORY_KEY_LENGTH, MAX_MEMORY_PAYLOAD_BYTES } from "../constants/memory.constants";
import { logger } from "../../utils/logger";

interface MemoryStoreEntry<T> {
  value: T;
  metadata: MemoryMetadata;
}

export class InMemoryProvider<T = unknown> implements MemoryProvider<T> {
  public readonly providerName = "in-memory" as const;
  private readonly storage = new Map<MemoryKey, MemoryStoreEntry<T>>();
  private readonly cleanupTimer: NodeJS.Timeout;

  constructor() {
    this.cleanupTimer = setInterval(() => this.removeExpiredEntries(), IN_MEMORY_CLEANUP_INTERVAL_MS);
    if (typeof this.cleanupTimer.unref === "function") {
      this.cleanupTimer.unref();
    }
  }

  public async get(key: MemoryKey): Promise<T | null> {
    this.validateKey(key);
    const entry = this.storage.get(key);
    if (!entry) {
      return null;
    }

    if (this.isExpired(entry)) {
      await this.delete(key);
      logger.info("memory.ttl.expired", { provider: this.providerName, key });
      return null;
    }

    return entry.value;
  }

  public async set(key: MemoryKey, value: T, ttlSeconds?: number): Promise<boolean> {
    this.validateKey(key);
    this.validatePayload(value);

    const now = new Date();
    const metadata: MemoryMetadata = {
      createdAt: now,
      updatedAt: now,
      expiresAt: ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : undefined,
    };

    this.storage.set(key, { value, metadata });
    return true;
  }

  public async delete(key: MemoryKey): Promise<boolean> {
    this.validateKey(key);
    return this.storage.delete(key);
  }

  public async exists(key: MemoryKey): Promise<boolean> {
    this.validateKey(key);
    const entry = this.storage.get(key);
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      await this.delete(key);
      logger.info("memory.ttl.expired", { provider: this.providerName, key });
      return false;
    }

    return true;
  }

  public async expire(key: MemoryKey, ttlSeconds: number): Promise<boolean> {
    this.validateKey(key);
    if (ttlSeconds <= 0) {
      throw new MemoryValidationError("TTL must be greater than zero");
    }

    const entry = this.storage.get(key);
    if (!entry || this.isExpired(entry)) {
      await this.delete(key);
      return false;
    }

    entry.metadata.expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    entry.metadata.updatedAt = new Date();
    this.storage.set(key, entry);
    return true;
  }

  public async clear(): Promise<void> {
    this.storage.clear();
  }

  public async healthCheck(): Promise<MemoryHealthReport> {
    return { provider: this.providerName, status: "healthy" };
  }

  private isExpired(entry: MemoryStoreEntry<T>): boolean {
    return !!entry.metadata.expiresAt && entry.metadata.expiresAt.getTime() <= Date.now();
  }

  private removeExpiredEntries(): void {
    const before = this.storage.size;
    let expired = 0;

    for (const [key, entry] of this.storage.entries()) {
      if (this.isExpired(entry)) {
        this.storage.delete(key);
        expired += 1;
      }
    }

    if (expired > 0) {
      logger.info("memory.cleanup.completed", {
        provider: this.providerName,
        removed: expired,
        total: this.storage.size,
      });
    }

    logger.info("memory.cleanup.status", {
      provider: this.providerName,
      expired,
      before,
      after: this.storage.size,
    });
  }

  private validateKey(key: MemoryKey): void {
    if (!key || typeof key !== "string" || !key.trim()) {
      throw new MemoryValidationError("Memory key must be a non-empty string");
    }
    if (key.length > MAX_MEMORY_KEY_LENGTH) {
      throw new MemoryValidationError(`Memory key must not exceed ${MAX_MEMORY_KEY_LENGTH} characters`);
    }
  }

  private validatePayload(value: T): void {
    let payload: string;
    try {
      payload = JSON.stringify(value) ?? "";
    } catch (error) {
      throw new MemoryValidationError("Memory payload must be serializable JSON");
    }

    if (!payload) {
      throw new MemoryValidationError("Memory payload must not be empty");
    }
    if (payload.length > MAX_MEMORY_PAYLOAD_BYTES) {
      throw new MemoryValidationError(`Memory payload must not exceed ${MAX_MEMORY_PAYLOAD_BYTES} bytes`);
    }
  }
}
