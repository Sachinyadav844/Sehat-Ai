export interface KnowledgeBaseMetadata {
  id: string;
  title: string;
  source: string;
  sourceOrganization: string;
  category: string;
  language: string;
  disease?: string;
  severity?: string;
  emergencyLevel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseDocument {
  id: string;
  title: string;
  content: string;
  metadata: KnowledgeBaseMetadata;
}

export type ChunkType =
  | "symptom"
  | "disease"
  | "emergency"
  | "medicine"
  | "triage"
  | "treatment"
  | "guideline"
  | "research-paper";

export interface KnowledgeBaseChunk {
  chunkId: string;
  documentId: string;
  source: string;
  sourceOrganization: string;
  content: string;
  disease?: string;
  severity?: string;
  language: string;
  confidence: number;
  medicalCategory: ChunkType;
  createdAt: string;
  updatedAt: string;
}
