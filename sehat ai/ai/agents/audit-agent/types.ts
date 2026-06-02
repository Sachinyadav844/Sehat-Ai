export interface AuditAgentInput {
  requestId: string;
  userId: string;
  symptomProfile: unknown;
  severityResult: unknown;
  safetyResult: unknown;
  emergencyResult: unknown;
  appointment: unknown;
  report: unknown;
}

export interface AuditAgentOutput {
  auditId: string;
  auditedAt: string;
  status: string;
  details: string;
}
