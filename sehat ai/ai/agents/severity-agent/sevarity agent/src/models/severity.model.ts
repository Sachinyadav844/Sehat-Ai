import { RiskLevel } from '../interfaces/severity.interface';

export interface SeverityModel {
  riskLevel: RiskLevel;
  riskScore: number;
  confidence: number;
  emergency: boolean;
  clinicalSummary: string;
  recommendations: string[];
  reasoning: string[];
}
