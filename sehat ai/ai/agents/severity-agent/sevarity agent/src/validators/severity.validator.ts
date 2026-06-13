import { SeverityResponse } from '../interfaces/severity.interface';

export const validateSeverityResponse = (response: SeverityResponse): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!response || typeof response !== 'object') {
    errors.push('Response must be an object.');
    return { valid: false, errors };
  }

  if (typeof response.riskScore !== 'number' || response.riskScore < 0 || response.riskScore > 100) {
    errors.push('riskScore must be a number between 0 and 100.');
  }

  if (typeof response.confidence !== 'number' || response.confidence < 0 || response.confidence > 1) {
    errors.push('confidence must be a number between 0.0 and 1.0.');
  }

  if (typeof response.emergency !== 'boolean') {
    errors.push('emergency must be a boolean.');
  }

  if (typeof response.clinicalSummary !== 'string' || response.clinicalSummary.length === 0) {
    errors.push('clinicalSummary is required.');
  }

  if (!Array.isArray(response.recommendations)) {
    errors.push('recommendations must be an array of strings.');
  }

  if (!Array.isArray(response.reasoning)) {
    errors.push('reasoning must be an array of strings.');
  }

  return { valid: errors.length === 0, errors };
};
