export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EMERGENCY';

export interface SeverityRequest {
  sessionId: string;
  symptoms: string[];
  duration: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  language: string;
}

export interface SeverityResponse {
  riskLevel: RiskLevel;
  riskScore: number;
  confidence: number;
  emergency: boolean;
  clinicalSummary: string;
  recommendations: string[];
  reasoning: string[];
}

export interface MedicalKnowledgeProvider {
  searchSymptoms(query: string): Promise<string[]>;
  searchGuidelines(topic: string): Promise<string[]>;
}
