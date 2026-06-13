import { LANGUAGE_AGENT_PROMPT } from "./prompt";
import { LanguageAgentValidator } from "./validator";
import type { LanguageAgentInput, LanguageAgentOutput } from "./types";

export class LanguageAgent {
  private validator = new LanguageAgentValidator();

  async analyze(input: LanguageAgentInput): Promise<LanguageAgentInput> {
    return input;
  }

  async validate(input: LanguageAgentOutput): Promise<boolean> {
    return this.validator.validate(input);
  }

  async execute(input: LanguageAgentInput): Promise<LanguageAgentOutput> {
    const detectedLanguage = input.language || input.sourceLanguage || "en";
    const targetLanguage = input.targetLanguage || detectedLanguage;
    const translatedText = targetLanguage !== detectedLanguage
      ? `Translated (${detectedLanguage} -> ${targetLanguage}): ${input.text}`
      : input.text;

    const output: LanguageAgentOutput = {
      language: detectedLanguage,
      detectedLanguage,
      translatedText,
      originalText: input.text,
    };

    if (!(await this.validate(output))) {
      throw new Error("LanguageAgent produced invalid output");
    }

    return output;
  }
}
