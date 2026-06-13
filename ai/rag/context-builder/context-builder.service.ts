import type { RerankedResult } from "../reranking/rerank.service";

export interface ContextBuilderOutput {
  query: string;
  language: string;
  medicalContext: string[];
  emergencyIndicators: string[];
  relatedDiseases: string[];
  guidelines: string[];
  sources: string[];
  confidence: number;
}

export class ContextBuilderService {
  build(query: string, language: string, results: RerankedResult[]): ContextBuilderOutput {
    const sources = new Set<string>();
    const medicalContext: string[] = [];
    const emergencyIndicators = new Set<string>();
    const relatedDiseases = new Set<string>();
    const guidelines = new Set<string>();
    let confidenceAccumulator = 0;

    results.forEach((result) => {
      const payload = result.payload;
      sources.add(`${payload.source} (${payload.sourceOrganization})`);
      medicalContext.push(payload.content);
      confidenceAccumulator += payload.confidence;

      if (payload.emergencyLevel) {
        emergencyIndicators.add(payload.emergencyLevel);
      }
      if (payload.disease) {
        relatedDiseases.add(payload.disease);
      }
      if (payload.category.includes("guideline")) {
        guidelines.add(payload.content.slice(0, 240));
      }
    });

    const averageConfidence = results.length > 0 ? confidenceAccumulator / results.length : 0;
    return {
      query,
      language,
      medicalContext,
      emergencyIndicators: Array.from(emergencyIndicators),
      relatedDiseases: Array.from(relatedDiseases),
      guidelines: Array.from(guidelines),
      sources: Array.from(sources),
      confidence: Number(averageConfidence.toFixed(2))
    };
  }
}
