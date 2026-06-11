import { RiskLevel } from '../interfaces/severity.interface';

export const riskLevelThresholds: Record<RiskLevel, { min: number; max: number }> = {
  LOW: { min: 0, max: 25 },
  MODERATE: { min: 26, max: 60 },
  HIGH: { min: 61, max: 85 },
  EMERGENCY: { min: 86, max: 100 }
};

export const riskLevels: RiskLevel[] = ['LOW', 'MODERATE', 'HIGH', 'EMERGENCY'];

export const getRiskLevelForScore = (score: number): RiskLevel => {
  if (score >= riskLevelThresholds.EMERGENCY.min) {
    return 'EMERGENCY';
  }
  if (score >= riskLevelThresholds.HIGH.min) {
    return 'HIGH';
  }
  if (score >= riskLevelThresholds.MODERATE.min) {
    return 'MODERATE';
  }
  return 'LOW';
};
