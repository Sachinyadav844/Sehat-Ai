import { MemoryProviderName } from "../types/memory.types";

const booleanFromEnv = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined || value === null) {
    return fallback;
  }
  return value.toLowerCase().trim() === "true";
};

const numericFromEnv = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const MEMORY_PROVIDER = (process.env.MEMORY_PROVIDER || "in-memory").toLowerCase() as MemoryProviderName;
export const REDIS_ENABLED = booleanFromEnv(process.env.REDIS_ENABLED, false);
export const REDIS_HOST = process.env.REDIS_HOST || "localhost";
export const REDIS_PORT = numericFromEnv(process.env.REDIS_PORT, 6379);
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;
export const REDIS_DB = numericFromEnv(process.env.REDIS_DB, 0);
export const REDIS_KEY_PREFIX = process.env.REDIS_KEY_PREFIX || "sehatai:";
export const REDIS_CONNECT_TIMEOUT_MS = numericFromEnv(process.env.REDIS_CONNECT_TIMEOUT_MS, 10000);
export const IN_MEMORY_CLEANUP_INTERVAL_MS = 60000;
export const MAX_MEMORY_KEY_LENGTH = 256;
export const MAX_MEMORY_PAYLOAD_BYTES = 100_000;
export const MAX_MEMORY_VALUE_DEPTH = 50;
