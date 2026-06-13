import { RiskLevel } from '../interfaces/severity.interface';
import { getRiskLevelForScore } from '../models/risk.model';
import durationImpactData from '../datasets/duration-risk/duration-impact';
import ageRiskData from '../datasets/age-risk/age-risk';

const normalizeDuration = (duration: string): string => {
  const parsed = duration.trim().toLowerCase();
  const cleaned = parsed.replace(/\s+/g, ' ');
  return cleaned;
};

export const calculateDurationImpact = (duration: string): number => {
  const normalized = normalizeDuration(duration);
  if (durationImpactData[normalized]) {
    return durationImpactData[normalized];
  }

  const daysMatch = normalized.match(/(\d+)\s*day/);
  if (daysMatch) {
    const days = Number(daysMatch[1]);
    if (days >= 14) return 25;
    if (days >= 7) return 15;
    if (days >= 3) return 10;
    return 5;
  }

  const weeksMatch = normalized.match(/(\d+)\s*week/);
  if (weeksMatch) {
    const weeks = Number(weeksMatch[1]);
    return weeks >= 2 ? 25 : 15;
  }

  return 5;
};

export const calculateAgeMultiplier = (age: number): number => {
  if (age <= 2) return ageRiskData.infant ?? 1.2;
  if (age <= 17) return ageRiskData.child ?? 1.0;
  if (age >= 65) return ageRiskData.olderAdult ?? 1.3;
  return ageRiskData.adult ?? 1.0;
};

export const normalizeRiskScore = (score: number): number => {
  if (Number.isNaN(score) || score < 0) {
    return 0;
  }
  if (score > 100) {
    return 100;
  }
  return Math.round(score);
};

export const calculateRisk = (baseScore: number, durationImpact: number, ageMultiplier: number, emergencyDetected: boolean): { riskScore: number; riskLevel: RiskLevel } => {
  const adjusted = baseScore + durationImpact;
  const weighted = emergencyDetected ? Math.max(adjusted, 86) : Math.min(adjusted * ageMultiplier, 100);
  const score = normalizeRiskScore(weighted);
  const level = emergencyDetected ? 'EMERGENCY' : getRiskLevelForScore(score);
  return { riskScore: score, riskLevel: level };
};
