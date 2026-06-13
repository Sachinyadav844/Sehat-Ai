import type { VectorMetadata } from "../../vector-db/qdrant/vector.service";

export interface RerankCandidate {
  id: string;
  score: number;
  payload: VectorMetadata & { content: string };
}

export interface RerankedResult {
  id: string;
  finalScore: number;
  originalScore: number;
  payload: RerankCandidate["payload"];
}

export class RerankService {
  rerank(results: RerankCandidate[], query: string): RerankedResult[] {
    return results
      .map((item) => {
        const emergencyBoost = item.payload.emergencyLevel === "critical" ? 0.25 : item.payload.emergencyLevel === "high" ? 0.15 : 0;
        const guidelineBoost = item.payload.category.includes("guideline") ? 0.15 : 0;
        const confidenceWeight = item.payload.confidence;
        const sourceQuality = item.payload.sourceOrganization.toLowerCase().includes("who") ? 0.1 : 0;
        const relevanceScore = item.score;
        const finalScore = relevanceScore * 0.55 + confidenceWeight * 0.2 + emergencyBoost + guidelineBoost + sourceQuality;

        return {
          id: item.id,
          finalScore,
          originalScore: item.score,
          payload: item.payload
        };
      })
      .sort((a, b) => b.finalScore - a.finalScore);
  }
}
