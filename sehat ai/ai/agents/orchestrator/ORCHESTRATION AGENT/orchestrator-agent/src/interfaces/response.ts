export interface UnifiedResponse {
  summary: string;
  symptoms?: Array<string | Record<string, unknown>>;
  risk?: string;
  riskScore?: number;
  confidence: string;
  recommendation: string;
  recommendations?: string[];
  nextAction?: string;
  emergencyMessage?: string;
  safetyIssues?: string[];
  metadata: Record<string, unknown>;
}
