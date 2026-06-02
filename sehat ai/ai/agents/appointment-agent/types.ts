export interface AppointmentAgentInput {
  patientId: string;
  hospitalRecommendations: unknown[];
  symptomProfile: unknown;
  riskLevel: string;
}

export interface AppointmentAgentOutput {
  appointmentId: string;
  patientId: string;
  hospitalId: string;
  doctor: string;
  specialty: string;
  scheduledAt: string;
  status: string;
  notes: string;
}
