import { MemoryKey, MemoryHealthReport } from "../types/memory.types";

export interface MemoryProvider<T = unknown> {
  readonly providerName: string;
  get(key: MemoryKey): Promise<T | null>;
  set(key: MemoryKey, value: T, ttlSeconds?: number): Promise<boolean>;
  delete(key: MemoryKey): Promise<boolean>;
  exists(key: MemoryKey): Promise<boolean>;
  expire(key: MemoryKey, ttlSeconds: number): Promise<boolean>;
  clear(): Promise<void>;
  healthCheck(): Promise<MemoryHealthReport>;
}
