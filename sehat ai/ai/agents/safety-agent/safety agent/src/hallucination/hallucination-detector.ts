import unsupportedMedicines from '../../datasets/medicine-safety/index.json';
import contraindications from '../../datasets/contraindications/index.json';
import {SeverityResult} from '../interfaces/safety';

export interface HallucinationResult {
  hallucinationDetected: boolean;
  issues: string[];
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function detectHallucination(
  symptoms: string[],
  severityResult: SeverityResult,
  approvedRecommendations: string[],
  blockedRecommendations: string[]
): HallucinationResult {
  const issues: string[] = [];
  const normalizedSymptoms = symptoms.map(normalizeText);

  if (blockedRecommendations.length > 0) {
    issues.push('Detected blocked or unsupported recommendations.');
  }

  const hasEmergencySymptom = normalizedSymptoms.some((symptom) =>
    ['chest pain', 'shortness of breath', 'breathing difficulty', 'unconsciousness', 'stroke', 'anaphylaxis', 'severe bleeding', 'severe trauma'].some((keyword) => symptom.includes(keyword))
  );

  if (severityResult.riskLevel === 'LOW' && hasEmergencySymptom) {
    issues.push('Severity result conflicts with high-risk symptoms.');
  }

  approvedRecommendations.forEach((recommendation) => {
    const normalized = normalizeText(recommendation);
    if (unsupportedMedicines.some((entry) => normalized.includes(entry.toLowerCase()))) {
      issues.push(`Recommendation includes unsupported medical treatment: ${recommendation}`);
    }
  });

  blockedRecommendations.forEach((recommendation) => {
    if (contraindications.some((entry) => normalizeText(recommendation).includes(entry.toLowerCase()))) {
      issues.push(`Detected contraindicated recommendation: ${recommendation}`);
    }
  });

  return {
    hallucinationDetected: issues.length > 0,
    issues
  };
}
