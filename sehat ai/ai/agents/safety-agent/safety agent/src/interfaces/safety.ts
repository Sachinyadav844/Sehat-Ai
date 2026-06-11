import {RiskLevelString, SafetyLevel, EscalationLevel} from '../types';

export interface SeverityResult {
  riskLevel: RiskLevelString;
  riskScore: number;
  confidence: number;
}

export interface SafetyInput {
  sessionId: string;
  symptoms: string[];
  severityResult: SeverityResult;
  recommendations: string[];
}

export interface SafetyOutput {
  safe: boolean;
  emergency: boolean;
  escalationRequired: boolean;
  confidence: number;
  riskLevel: SafetyLevel;
  safetyWarnings: string[];
  approvedRecommendations: string[];
  blockedRecommendations: string[];
  hallucinationDetected: boolean;
  consistencyFailed: boolean;
  escalationLevel: EscalationLevel;
  validationErrors?: string[];
}
