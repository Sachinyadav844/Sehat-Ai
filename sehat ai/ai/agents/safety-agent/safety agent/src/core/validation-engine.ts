import {validateSymptoms, SymptomValidationResult} from '../validators/symptom.validator';
import {validateSeverity, SeverityValidationResult} from '../validators/severity.validator';
import {validateRecommendations, RecommendationValidationResult} from '../validators/recommendation.validator';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  symptoms?: SymptomValidationResult;
  severity?: SeverityValidationResult;
  recommendations?: RecommendationValidationResult;
}

const allowedTopLevelFields = new Set(['sessionId', 'symptoms', 'severityResult', 'recommendations']);

export function validatePayload(payload: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    return {valid: false, errors: ['Payload must be an object.'], warnings};
  }

  const candidate = payload as Record<string, unknown>;

  Object.keys(candidate).forEach((key) => {
    if (!allowedTopLevelFields.has(key)) {
      warnings.push(`Unexpected field detected: ${key}`);
    }
  });

  if (typeof candidate.sessionId !== 'string' || candidate.sessionId.trim().length === 0) {
    errors.push('sessionId is required and must be a non-empty string.');
  }

  const symptomResult = validateSymptoms(candidate.symptoms);
  const severityResult = validateSeverity(candidate.severityResult);
  const recommendationResult = validateRecommendations(candidate.recommendations);

  errors.push(...symptomResult.invalidSymptoms);
  errors.push(...severityResult.errors);

  warnings.push(...symptomResult.warnings);
  warnings.push(...recommendationResult.warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    symptoms: symptomResult,
    severity: severityResult,
    recommendations: recommendationResult
  };
}
