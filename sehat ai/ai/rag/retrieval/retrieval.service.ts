import { EmbeddingService } from "../../embeddings/services/embedding.service";
import { QdrantVectorService, VectorMetadata } from "../../vector-db/qdrant/vector.service";
import { RerankService, RerankedResult } from "../reranking/rerank.service";

export interface RetrievalOptions {
  topK?: number;
  category?: string;
  language?: string;
  emergencyPriority?: boolean;
  metadataFilter?: Record<string, string>;
}

export interface RetrievalResult {
  query: string;
  language: string;
  results: RerankedResult[];
}

export class RetrievalService {
  private embeddingService: EmbeddingService;
  private qdrantService: QdrantVectorService;
  private rerankService: RerankService;

  constructor(
    embeddingService: EmbeddingService,
    qdrantService: QdrantVectorService,
    rerankService: RerankService
  ) {
    this.embeddingService = embeddingService;
    this.qdrantService = qdrantService;
    this.rerankService = rerankService;
  }

  private buildFilter(options?: RetrievalOptions): Record<string, unknown> | undefined {
    if (!options?.metadataFilter) {
      return undefined;
    }
    const must = Object.entries(options.metadataFilter).map(([key, value]) => ({
      key,
      match: { value }
    }));
    return {
      must
    };
  }

  async search(query: string, collectionName: string, options: RetrievalOptions = {}): Promise<RetrievalResult> {
    const queryVector = await this.embeddingService.embedText(query);
    const filter = this.buildFilter(options);
    const rawResults = await this.qdrantService.searchVectors(collectionName, queryVector, options.topK ?? 10, filter);

    const prioritized = options.emergencyPriority
      ? rawResults.map((item) => ({
          ...item,
          score: item.score + (item.payload.emergencyLevel === "critical" ? 0.3 : item.payload.emergencyLevel === "high" ? 0.15 : 0)
        }))
      : rawResults;

    const reranked = this.rerankService.rerank(prioritized, query);
    return {
      query,
      language: options.language ?? "en",
      results: reranked
    };
  }
}
