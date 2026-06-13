import emergencySymptoms from '../../datasets/emergency-symptoms/index.json';
import {clinicalSafetyRules} from '../rules/safety.rules';
import {SeverityResult} from '../interfaces/safety';

export interface EmergencyDetectionResult {
  emergency: boolean;
  reasons: string[];
}

const normalizedEmergencySymptoms = emergencySymptoms.map((symptom) => symptom.toLowerCase());

function containsEmergencyKeyword(value: string): boolean {
  return normalizedEmergencySymptoms.some((keyword) => value.toLowerCase().includes(keyword));
}

export function evaluateEmergency(symptoms: string[], severityResult: SeverityResult): EmergencyDetectionResult {
  const reasons: string[] = [];
  const normalizedSymptoms = symptoms.map((symptom) => symptom.toLowerCase());

  normalizedSymptoms.forEach((symptom) => {
    if (containsEmergencyKeyword(symptom)) {
      reasons.push(`Emergency symptom detected: ${symptom}`);
    }
  });

  clinicalSafetyRules.forEach((rule) => {
    if (rule.conditions.every((condition) => normalizedSymptoms.some((symptom) => symptom.includes(condition)))) {
      reasons.push(`Clinical rule triggered: ${rule.description}`);
    }
  });

  if (severityResult.riskLevel === 'HIGH' && severityResult.riskScore >= 75) {
    if (normalizedSymptoms.some((symptom) => symptom.includes('chest pain') || symptom.includes('shortness of breath') || symptom.includes('breathing difficulty') || symptom.includes('unconsciousness'))) {
      reasons.push('High risk severity matches emergency symptoms.');
    }
  }

  return {emergency: reasons.length > 0, reasons};
}
