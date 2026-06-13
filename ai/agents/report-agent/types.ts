export interface ReportAgentInput {
  patientId: string;
  symptomProfile: unknown;
  severityResult: unknown;
  safetyResult: unknown;
  emergencyResult: unknown;
  hospitalRecommendations: unknown[];
  appointment: unknown;
}

export interface ReportAgentOutput {
  reportId: string;
  patientId: string;
  summary: string;
  findings: string[];
  recommendations: string[];
  createdAt: string;
}
