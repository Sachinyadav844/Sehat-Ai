import { describe, expect, it } from 'vitest';
import { validateSeverityRequest } from '../src/validators/symptom.validator';

describe('Severity Request Validator Branches', () => {
  it('rejects non-array symptoms and invalid gender', () => {
    const result = validateSeverityRequest({
      sessionId: '123',
      symptoms: 'fever',
      duration: '2 days',
      age: 30,
      gender: 'unknown',
      language: 'en'
    } as any);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('symptoms is required and must be an array.');
    expect(result.errors).toContain('gender is required and must be one of male, female, or other.');
  });
});
