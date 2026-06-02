import { v4 as uuidv4 } from "uuid";

export interface FaissVectorRecord {
  id: string;
  vector: number[];
  payload: Record<string, unknown>;
}

export class FaissFallbackService {
  private store = new Map<string, FaissVectorRecord>();

  createCollection(_collectionName: string): void {
    this.store.clear();
  }

  upsertVector(collectionName: string, record: Omit<FaissVectorRecord, "id"> & { id?: string }): FaissVectorRecord {
    const vectorId = record.id ?? uuidv4();
    const stored: FaissVectorRecord = {
      id: vectorId,
      vector: record.vector,
      payload: record.payload
    };
    this.store.set(`${collectionName}:${vectorId}`, stored);
    return stored;
  }

  deleteVector(collectionName: string, vectorId: string): void {
    this.store.delete(`${collectionName}:${vectorId}`);
  }

  searchVectors(collectionName: string, queryVector: number[], topK = 10) {
    const results: Array<{ id: string; score: number; payload: Record<string, unknown> }> = [];
    for (const record of this.store.values()) {
      if (!record.id.startsWith(`${collectionName}:`)) continue;
      const score = this.cosineSimilarity(queryVector, record.vector);
      results.push({ id: record.id, score, payload: record.payload });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, value, index) => sum + value * (b[index] ?? 0), 0);
    const normA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
    const normB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
    return normA === 0 || normB === 0 ? 0 : dot / (normA * normB);
  }
}
