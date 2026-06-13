import { EmbeddingVector } from "../models/embedding-models";

export interface EmbeddingCacheEntry {
  vector: EmbeddingVector;
  version: string;
  createdAt: string;
}

export class EmbeddingCache {
  private store = new Map<string, EmbeddingCacheEntry>();

  get(key: string): EmbeddingCacheEntry | undefined {
    return this.store.get(key);
  }

  set(key: string, value: EmbeddingCacheEntry): void {
    this.store.set(key, value);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  clear(): void {
    this.store.clear();
  }
}
