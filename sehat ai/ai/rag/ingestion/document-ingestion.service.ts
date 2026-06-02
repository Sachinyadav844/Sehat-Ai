import { DocumentLoaderService } from "../../knowledge-base/document-loader.service";
import { ChunkingService } from "../chunking/chunking.service";
import { EmbeddingService } from "../../embeddings/services/embedding.service";
import { QdrantVectorService } from "../../vector-db/qdrant/vector.service";
import type { ChunkType } from "../../knowledge-base/types";

export interface IngestionReport {
  documentId: string;
  title: string;
  category: string;
  chunksCreated: number;
  vectorsStored: number;
  warnings: string[];
  completedAt: string;
}

export class DocumentIngestionService {
  private loader = new DocumentLoaderService();
  private chunking = new ChunkingService();
  private embeddingService = new EmbeddingService();
  private vectorService = new QdrantVectorService();

  async ingestDocument(
    filePath: string,
    collectionName: string,
    category: string,
    source: string,
    medicalCategory: ChunkType,
    language = "en",
    sourceOrganization = "unknown"
  ): Promise<IngestionReport> {
    const document = await this.loader.loadDocument(filePath, category, source, language, sourceOrganization);
    const chunks = this.chunking.chunkDocument(document, medicalCategory);
    const vectors = await this.embeddingService.embedChunks(chunks.map((chunk) => ({ content: chunk.content })));

    await this.vectorService.createCollection(collectionName).catch(() => undefined);

    await Promise.all(
      chunks.map(async (chunk, index) => {
        await this.vectorService.upsertVector(collectionName, {
          id: chunk.chunkId,
          vector: vectors[index],
          payload: {
            id: chunk.chunkId,
            source: chunk.source,
            sourceOrganization: chunk.sourceOrganization,
            category,
            language: chunk.language,
            confidence: chunk.confidence,
            emergencyLevel: chunk.medicalCategory === "emergency" ? "high" : "normal",
            disease: chunk.disease,
            severity: chunk.severity,
            content: chunk.content
          }
        });
      })
    );

    return {
      documentId: document.id,
      title: document.title,
      category,
      chunksCreated: chunks.length,
      vectorsStored: chunks.length,
      warnings: [],
      completedAt: new Date().toISOString()
    };
  }
}
