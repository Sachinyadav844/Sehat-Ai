import { SeverityRequest } from '../interfaces/severity.interface';

const MAX_SYMPTOMS = 20;
const VALID_GENDERS = ['male', 'female', 'other'];

export const validateSeverityRequest = (payload: unknown): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const request = payload as Partial<SeverityRequest>;

  if (!request || typeof request !== 'object') {
    errors.push('Payload must be a JSON object.');
    return { valid: false, errors };
  }

  if (!request.sessionId || typeof request.sessionId !== 'string') {
    errors.push('sessionId is required and must be a string.');
  }

  if (!Array.isArray(request.symptoms)) {
    errors.push('symptoms is required and must be an array.');
  } else {
    if (request.symptoms.length === 0) {
      errors.push('symptoms list must contain at least one symptom.');
    }
    if (request.symptoms.length > MAX_SYMPTOMS) {
      errors.push(`symptoms list must not exceed ${MAX_SYMPTOMS} items.`);
    }
    request.symptoms.forEach((item, index) => {
      if (typeof item !== 'string' || item.trim().length === 0) {
        errors.push(`symptoms[${index}] must be a non-empty string.`);
      }
    });
  }

  if (request.duration == null || typeof request.duration !== 'string' || request.duration.trim().length === 0) {
    errors.push('duration is required and must be a non-empty string.');
  }

  if (typeof request.age !== 'number' || Number.isNaN(request.age) || request.age < 0 || request.age > 120) {
    errors.push('age is required and must be a valid number between 0 and 120.');
  }

  if (!request.gender || typeof request.gender !== 'string' || !VALID_GENDERS.includes(request.gender)) {
    errors.push('gender is required and must be one of male, female, or other.');
  }

  if (!request.language || typeof request.language !== 'string') {
    errors.push('language is required and must be a string.');
  }

  return { valid: errors.length === 0, errors };
};
