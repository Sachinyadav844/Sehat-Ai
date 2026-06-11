import { MemoryFactory } from "./factory/memory.factory";
import { MemoryService } from "./services/memory.service";

export function createMemoryService<T = unknown>(): MemoryService<T> {
  return new MemoryService<T>(MemoryFactory.create<T>());
}

export * from "./interfaces/memory-provider.interface";
export * from "./providers/in-memory.provider";
export * from "./providers/redis.provider";
export * from "./types/memory.types";
export * from "./constants/memory.constants";
export * from "./factory/memory.factory";
export * from "./services/memory.service";
