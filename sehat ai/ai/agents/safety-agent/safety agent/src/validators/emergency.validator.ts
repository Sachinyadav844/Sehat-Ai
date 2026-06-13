import {SeverityResult} from '../interfaces/safety';
import emergencySymptoms from '../../datasets/emergency-symptoms/index.json';
import {clinicalSafetyRules} from '../rules/safety.rules';

export interface EmergencyValidationResult {
  emergency: boolean;
  reasons: string[];
}

const normalizedEmergencySymptoms = emergencySymptoms.map((symptom) => symptom.toLowerCase());

function symptomMatchesEmergency(symptom: string): boolean {
  const normalized = symptom.toLowerCase();
  return normalizedEmergencySymptoms.some((keyword) => normalized.includes(keyword));
}

export function detectEmergency(symptoms: string[], severityResult: SeverityResult): EmergencyValidationResult {
  const reasons: string[] = [];
  const normalizedSymptoms = symptoms.map((symptom) => symptom.toLowerCase());

  if (normalizedSymptoms.some(symptomMatchesEmergency)) {
    reasons.push('Emergency symptom pattern matched.');
  }

  clinicalSafetyRules.forEach((rule) => {
    if (rule.conditions.every((condition) => normalizedSymptoms.some((text) => text.includes(condition)))) {
      reasons.push(`Clinical safety rule triggered: ${rule.description}`);
    }
  });

  if (severityResult.riskLevel === 'HIGH' && severityResult.riskScore >= 75) {
    const alertSymptoms = ['chest pain', 'shortness of breath', 'breathing difficulty', 'unconsciousness'];
    if (normalizedSymptoms.some((symptom) => alertSymptoms.some((trigger) => symptom.includes(trigger)))) {
      reasons.push('High severity rating supports emergency escalation.');
    }
  }

  const emergencyDetected = reasons.length > 0;
  return {emergency: emergencyDetected, reasons};
}
