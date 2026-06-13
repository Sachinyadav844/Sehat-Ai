import { v4 as uuidv4 } from "uuid";
import { KnowledgeBaseChunk, KnowledgeBaseDocument, ChunkType } from "../../knowledge-base/types";

export interface ChunkConfig {
  maxTokens: number;
  overlap: number;
}

export class ChunkingService {
  private readonly config: ChunkConfig;

  constructor(config: ChunkConfig = { maxTokens: 500, overlap: 100 }) {
    this.config = config;
  }

  private normalizeText(text: string): string {
    return text.replace(/\s+/g, " ").trim();
  }

  chunkDocument(
    document: KnowledgeBaseDocument,
    medicalCategory: ChunkType,
    confidence = 0.88
  ): KnowledgeBaseChunk[] {
    return this.chunkText(document.content, {
      documentId: document.id,
      source: document.metadata.source,
      sourceOrganization: document.metadata.sourceOrganization,
      language: document.metadata.language,
      medicalCategory,
      confidence,
      disease: document.metadata.disease,
      severity: document.metadata.severity
    });
  }

  chunkText(
    content: string,
    metadata: Omit<KnowledgeBaseChunk, "chunkId" | "content" | "createdAt" | "updatedAt" | "documentId" | "source" | "sourceOrganization"> & {
      documentId: string;
      source: string;
      sourceOrganization: string;
      language: string;
      medicalCategory: ChunkType;
      confidence: number;
    }
  ): KnowledgeBaseChunk[] {
    const normalized = this.normalizeText(content);
    const words = normalized.split(" ");
    const chunks: KnowledgeBaseChunk[] = [];
    const { maxTokens, overlap } = this.config;

    for (let start = 0; start < words.length; start += maxTokens - overlap) {
      const end = Math.min(start + maxTokens, words.length);
      const chunkContent = words.slice(start, end).join(" ");
      const now = new Date().toISOString();

      chunks.push({
        chunkId: uuidv4(),
        documentId: metadata.documentId,
        source: metadata.source,
        sourceOrganization: metadata.sourceOrganization,
        content: chunkContent,
        disease: metadata.disease,
        severity: metadata.severity,
        language: metadata.language,
        confidence: metadata.confidence,
        medicalCategory: metadata.medicalCategory,
        createdAt: now,
        updatedAt: now
      });

      if (end === words.length) {
        break;
      }
    }

    return chunks;
  }
}
