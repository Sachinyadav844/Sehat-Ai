export interface LanguageAgentInput {
  text: string;
  language?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
}

export interface LanguageAgentOutput {
  language: string;
  detectedLanguage: string;
  translatedText: string;
  originalText: string;
}
