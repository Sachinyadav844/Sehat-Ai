import { QdrantClient } from "@qdrant/js-client-rest";

export interface VectorMetadata {
  id: string;
  source: string;
  sourceOrganization: string;
  category: string;
  language: string;
  confidence: number;
  emergencyLevel?: string;
  disease?: string;
  severity?: string;
}

export interface VectorRecord {
  id: string;
  vector: number[];
  payload: VectorMetadata & { content: string };
}

export class QdrantVectorService {
  private client: QdrantClient;

  constructor(url = process.env.QDRANT_URL || "http://localhost:6333") {
    this.client = new QdrantClient({ url });
  }

  async createCollection(collectionName: string): Promise<void> {
    await this.client.createCollection(collectionName, {
      vectors: {
        size: 1536,
        distance: "Cosine"
      }
    } as any);
  }

  async upsertVector(collectionName: string, record: VectorRecord): Promise<void> {
    await this.client.upsert(collectionName, {
      wait: true,
      points: [
        {
          id: record.id,
          vector: record.vector,
          payload: record.payload
        }
      ]
    } as any);
  }

  async deleteVector(collectionName: string, vectorId: string): Promise<void> {
    await this.client.deleteVectors(collectionName, {
      wait: true,
      points: [vectorId]
    } as any);
  }

  async searchVectors(
    collectionName: string,
    queryVector: number[],
    topK = 10,
    filter?: Record<string, unknown>
  ): Promise<Array<{ id: string; score: number; payload: VectorMetadata & { content: string } }>> {
    const result = await this.client.search(collectionName, {
      vector: queryVector,
      limit: topK,
      filter,
      with_payload: true
    } as any);

    return result.map((item: any) => ({
      id: item.id as string,
      score: item.score ?? 0,
      payload: item.payload as VectorMetadata & { content: string }
    }));
  }

  async backupVectors(collectionName: string): Promise<Array<VectorRecord>> {
    const response = await this.client.scroll(collectionName, {
      limit: 1000,
      with_payload: true,
      with_vector: true
    } as any);
    return response.points.map((item: any) => ({
      id: item.id as string,
      vector: item.vector as number[],
      payload: item.payload as VectorMetadata & { content: string }
    }));
  }
}
