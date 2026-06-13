import knownEmergencySymptoms from '../../datasets/emergency-symptoms/index.json';

export interface SymptomValidationResult {
  valid: boolean;
  invalidSymptoms: string[];
  unknownSymptoms: string[];
  warnings: string[];
}

const knownSymptoms = [
  ...knownEmergencySymptoms,
  'fever',
  'nausea',
  'dizziness',
  'headache',
  'fatigue',
  'abdominal pain',
  'cough'
].map((symptom) => symptom.toLowerCase());

export function validateSymptoms(symptoms: unknown): SymptomValidationResult {
  const result: SymptomValidationResult = {
    valid: true,
    invalidSymptoms: [],
    unknownSymptoms: [],
    warnings: []
  };

  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    result.valid = false;
    result.invalidSymptoms.push('Symptoms must be a non-empty array.');
    return result;
  }

  symptoms.forEach((symptom) => {
    if (typeof symptom !== 'string' || symptom.trim().length === 0) {
      result.valid = false;
      result.invalidSymptoms.push('Each symptom must be a non-empty string.');
      return;
    }

    const normalized = symptom.trim().toLowerCase();
    if (!knownSymptoms.includes(normalized)) {
      result.unknownSymptoms.push(symptom);
      result.warnings.push(`Unknown symptom detected: ${symptom}`);
    }
  });

  return result;
}
