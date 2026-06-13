import axios from "axios";

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export class TranslationService {
  private apiUrl = process.env.TRANSLATION_API_URL || "";

  async translate(text: string, targetLanguage: string): Promise<TranslationResult> {
    if (!this.apiUrl) {
      return {
        originalText: text,
        translatedText: text,
        sourceLanguage: this.detectLanguage(text),
        targetLanguage
      };
    }

    const response = await axios.post(this.apiUrl, {
      text,
      targetLanguage
    }, {
      timeout: 20000,
      headers: { "Content-Type": "application/json" }
    });

    return {
      originalText: text,
      translatedText: response.data.translatedText || text,
      sourceLanguage: response.data.sourceLanguage || this.detectLanguage(text),
      targetLanguage
    };
  }

  detectLanguage(text: string): string {
    if (!text || !text.trim().length) {
      return "en";
    }
    if (/[\u0600-\u06FF]/.test(text)) return "ar";
    if (/[\u0900-\u097F]/.test(text)) return "hi";
    return "en";
  }
}
