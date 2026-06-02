export interface SafetyAgentInput {
  symptomProfile: unknown;
  severityResult: unknown;
}

export interface SafetyAgentOutput {
  safeResponse: boolean;
  confidence: number;
  safetyScore: number;
  issues: string[];
}
