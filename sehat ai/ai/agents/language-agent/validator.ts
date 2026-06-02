import type { LanguageAgentOutput } from "./types";

export class LanguageAgentValidator {
  async validate(output: LanguageAgentOutput): Promise<boolean> {
    return (
      typeof output.detectedLanguage === "string" &&
      typeof output.translatedText === "string" &&
      typeof output.originalText === "string"
    );
  }
}
