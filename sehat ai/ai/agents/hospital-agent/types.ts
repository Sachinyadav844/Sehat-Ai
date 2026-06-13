export interface HospitalAgentInput {
  location: string;
  disease: string;
  riskLevel: string;
}

export interface HospitalRecommendation {
  hospitalId: string;
  name: string;
  distanceKm: number;
  specialist: string;
  emergencyAvailable: boolean;
  score: number;
}
