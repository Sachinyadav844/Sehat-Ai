import { InMemoryProvider } from "../providers/in-memory.provider";
import { RedisProvider } from "../providers/redis.provider";
import { MemoryProvider } from "../interfaces/memory-provider.interface";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB, REDIS_KEY_PREFIX, REDIS_CONNECT_TIMEOUT_MS } from "../constants/memory.constants";
import { MemoryProviderName } from "../types/memory.types";
import { logger } from "../../utils/logger";

const booleanFromEnv = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined || value === null) {
    return fallback;
  }
  return value.toLowerCase().trim() === "true";
};

const getMemoryProviderName = (): MemoryProviderName => {
  const raw = (process.env.MEMORY_PROVIDER || "in-memory").toLowerCase().trim();
  return raw === "redis" ? "redis" : "in-memory";
};

export class MemoryFactory {
  public static create<T = unknown>(): MemoryProvider<T> {
    const memoryProvider = getMemoryProviderName();
    const redisEnabled = booleanFromEnv(process.env.REDIS_ENABLED, false);

    const provider = memoryProvider === "redis" || redisEnabled
      ? new RedisProvider<T>({
          host: REDIS_HOST,
          port: REDIS_PORT,
          password: REDIS_PASSWORD,
          db: REDIS_DB,
          keyPrefix: REDIS_KEY_PREFIX,
          connectTimeoutMs: REDIS_CONNECT_TIMEOUT_MS,
        })
      : new InMemoryProvider<T>();

    logger.info("memory.provider.selected", {
      provider: provider.providerName,
      memoryProvider,
      redisEnabled,
    });

    return provider;
  }
}
