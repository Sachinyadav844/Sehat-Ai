import { describe, expect, it } from 'vitest';
import { validateSeverityRequest } from '../src/validators/symptom.validator';

describe('Severity Request Validator', () => {
  it('validates a complete request successfully', () => {
    const result = validateSeverityRequest({
      sessionId: 'abc',
      symptoms: ['fever'],
      duration: '1 day',
      age: 25,
      gender: 'female',
      language: 'en'
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects invalid symptom payload and missing sessionId', () => {
    const result = validateSeverityRequest({
      symptoms: [123],
      duration: '',
      age: -5,
      gender: 'unknown',
      language: null
    } as any);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('sessionId is required and must be a string.');
    expect(result.errors).toContain('symptoms[0] must be a non-empty string.');
    expect(result.errors).toContain('duration is required and must be a non-empty string.');
    expect(result.errors).toContain('age is required and must be a valid number between 0 and 120.');
  });
});
