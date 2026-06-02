export interface SafetyValidationResult {
  isSafe: boolean;
  confidence: number;
  issues: string[];
  emergencyOverride: boolean;
}

export class SafetyValidationService {
  detectHallucination(text: string): boolean {
    const hallucinationPatterns = [
      /\b(cure|guarantee|definitive|completely avoid)\b/i,
      /\b(unproven|experimental|unknown)\b/i
    ];
    return hallucinationPatterns.some((pattern) => pattern.test(text));
  }

  validateSource(source: string): boolean {
    const trustedSources = ["who", "cdc", "nih", "pubmed", "unesco", "who.int", "cdc.gov", "nih.gov"];
    return trustedSources.some((trusted) => source.toLowerCase().includes(trusted));
  }

  scoreConfidence(text: string): number {
    const riskTerms = ["may", "might", "possible", "consult", "seek medical attention"];
    const riskMatches = riskTerms.filter((term) => new RegExp(`\\b${term}\\b`, "i").test(text));
    return Math.max(0, 1 - riskMatches.length * 0.15);
  }

  validateResponse(source: string, content: string): SafetyValidationResult {
    const hospitalOverride = /\b(emergency|urgent|call 911|seek immediate)\b/i.test(content);
    const hallucination = this.detectHallucination(content);
    const trusted = this.validateSource(source);
    const confidence = this.scoreConfidence(content);

    return {
      isSafe: trusted && !hallucination,
      confidence,
      issues: [
        ...(hallucination ? ["Hallucination risk detected"] : []),
        ...(!trusted ? ["Untrusted source"] : []),
        ...(hospitalOverride ? ["Emergency override indicator"] : [])
      ],
      emergencyOverride: hospitalOverride
    };
  }
}
