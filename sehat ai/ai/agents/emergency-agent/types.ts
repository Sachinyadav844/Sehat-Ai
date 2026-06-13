export interface EmergencyAgentInput {
  symptomProfile: unknown;
  severityResult: unknown;
  safetyResult: unknown;
}

export interface EmergencyAgentOutput {
  emergencyDetected: boolean;
  emergencyType: "CRITICAL" | "URGENT" | "ROUTINE";
  reason: string;
  recommendedAction: string;
}
