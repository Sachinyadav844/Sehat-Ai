import crypto from "node:crypto";
import axios from "axios";
import { EmbeddingCache } from "../cache/embedding-cache";
import { EmbeddingVector, EMBEDDING_MODELS, EmbeddingModel } from "../models/embedding-models";

interface EmbeddingRequest {
  model: EmbeddingModel;
  inputs: string[];
}

interface EmbeddingResponse {
  embeddings: EmbeddingVector[];
}

export class EmbeddingService {
  private cache = new EmbeddingCache();
  private version = "1.0";
  private apiUrl = process.env.EMBEDDING_API_URL || "";
  private defaultModel: EmbeddingModel = EMBEDDING_MODELS.BGE;

  private async retry<T>(fn: () => Promise<T>): Promise<T> {
    const maxAttempts = 3;
    let attempt = 0;
    let lastError: unknown;

    while (attempt < maxAttempts) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        attempt += 1;
        await new Promise((resolve) => setTimeout(resolve, 200 * attempt));
      }
    }

    throw lastError;
  }

  private async requestEmbeddings(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    if (!this.apiUrl) {
      return {
        embeddings: request.inputs.map((input) => this.createFallbackEmbedding(input))
      };
    }

    const response = await axios.post(this.apiUrl, {
      model: request.model,
      inputs: request.inputs
    }, {
      timeout: 20000,
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.OPENAI_API_KEY ? `Bearer ${process.env.OPENAI_API_KEY}` : ""
      }
    });

    const embeddings = (response.data?.data as Array<{ embedding: number[] }> | undefined)?.map((item) => item.embedding) ?? [];
    if (!embeddings.length) {
      throw new Error("Embedding service returned no vectors");
    }

    return { embeddings };
  }

  private createFallbackEmbedding(source: string): EmbeddingVector {
    const hash = crypto.createHash("sha256").update(source).digest();
    const vector: EmbeddingVector = [];
    for (let i = 0; i < 1536; i += 2) {
      const slice = hash.readUInt16BE((i % hash.length));
      vector.push((slice / 65535) * 2 - 1);
    }
    return vector;
  }

  private cacheKey(model: EmbeddingModel, text: string): string {
    return `${model}:${crypto.createHash("sha256").update(text).digest("hex")}`;
  }

  async embedText(text: string, model: EmbeddingModel = this.defaultModel): Promise<EmbeddingVector> {
    const key = this.cacheKey(model, text);
    const existing = this.cache.get(key);
    if (existing) {
      return existing.vector;
    }

    const { embeddings } = await this.retry(() => this.requestEmbeddings({ model, inputs: [text] }));
    const vector = embeddings[0];
    this.cache.set(key, { vector, version: this.version, createdAt: new Date().toISOString() });
    return vector;
  }

  async embedDocument(document: { content: string; metadata: Record<string, unknown> }, model: EmbeddingModel = this.defaultModel): Promise<EmbeddingVector> {
    return this.embedText(`${document.metadata.title ?? "document"}\n${document.content}`, model);
  }

  async embedChunks(chunks: Array<{ content: string }>, model: EmbeddingModel = this.defaultModel): Promise<EmbeddingVector[]> {
    const inputs = chunks.map((chunk) => chunk.content);
    const results: EmbeddingVector[] = [];
    const batchSize = 16;

    for (let offset = 0; offset < inputs.length; offset += batchSize) {
      const batch = inputs.slice(offset, offset + batchSize);
      const response = await this.retry(() => this.requestEmbeddings({ model, inputs: batch }));
      results.push(...response.embeddings);
    }

    return results;
  }

  async embedDataset(dataset: { records: unknown[] }, model: EmbeddingModel = EMBEDDING_MODELS.MULTILINGUAL): Promise<Record<string, EmbeddingVector>> {
    const mapped: Record<string, EmbeddingVector> = {};
    const records = dataset.records;
    const size = Math.min(records.length, 64);

    for (let i = 0; i < size; i += 1) {
      const item = records[i];
      const text = JSON.stringify(item);
      mapped[`record-${i}`] = await this.embedText(text, model);
    }

    return mapped;
  }

  async embedMedicalGuideline(content: string): Promise<EmbeddingVector> {
    return this.embedText(content, EMBEDDING_MODELS.INSTRUCTOR);
  }
}
