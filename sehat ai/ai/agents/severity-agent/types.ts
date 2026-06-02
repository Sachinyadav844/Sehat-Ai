export interface SeverityAgentInput {
  symptoms: unknown;
  duration?: string;
}

export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface SeverityAgentOutput {
  severity: SeverityLevel;
  riskScore: number;
  emergencyClassification: boolean;
  confidence: number;
}
