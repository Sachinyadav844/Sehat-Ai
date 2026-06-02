export interface MemoryAgentInput {
  requestId: string;
  userId: string;
  input: string;
  symptomProfile: unknown;
  severityResult: unknown;
  safetyResult: unknown;
  emergencyResult: unknown;
  hospitalRecommendations: unknown[];
  appointment: unknown;
  report: unknown;
}

export interface MemoryAgentOutput {
  sessionId: string;
  patientId: string;
  memoryStored: boolean;
  summary: string;
}
