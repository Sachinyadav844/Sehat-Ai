import { detectLanguage } from "./language-detector";
import { TranslationService } from "./translation.service";
import { RetrievalService, RetrievalResult } from "../retrieval/retrieval.service";
import { ContextBuilderService } from "../context-builder/context-builder.service";

export interface MultilingualRetrievalOutput {
  query: string;
  language: string;
  translatedQuery: string;
  retrieval: RetrievalResult;
  context: ReturnType<ContextBuilderService["build"]>;
}

export class MultilingualRetrievalService {
  private translationService = new TranslationService();
  private contextBuilder = new ContextBuilderService();

  constructor(private retrievalService: RetrievalService) {}

  async search(query: string, collectionName: string, targetLanguage = "en") {
    const sourceLanguage = detectLanguage(query);
    const normalizedQuery = sourceLanguage !== targetLanguage ? (await this.translationService.translate(query, "en")).translatedText : query;
    const retrieval = await this.retrievalService.search(normalizedQuery, collectionName, {
      topK: 10,
      language: sourceLanguage,
      emergencyPriority: true
    });

    const context = this.contextBuilder.build(normalizedQuery, sourceLanguage, retrieval.results);
    const responseText = targetLanguage !== sourceLanguage ? (await this.translationService.translate(context.medicalContext.join("\n\n"), targetLanguage)).translatedText : context.medicalContext.join("\n\n");

    return {
      query,
      language: targetLanguage,
      translatedQuery: normalizedQuery,
      retrieval,
      context: {
        ...context,
        medicalContext: [responseText]
      }
    } as MultilingualRetrievalOutput;
  }
}
