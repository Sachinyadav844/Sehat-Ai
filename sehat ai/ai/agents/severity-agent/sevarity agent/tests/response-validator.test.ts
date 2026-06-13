import { describe, expect, it } from 'vitest';
import { validateSeverityResponse } from '../src/validators/severity.validator';

describe('Severity Response Validator', () => {
  it('rejects invalid severity response payloads', () => {
    const result = validateSeverityResponse({
      riskScore: -10,
      confidence: 1.5,
      emergency: 'yes' as any,
      clinicalSummary: '',
      recommendations: 'not-an-array' as any,
      reasoning: 'not-an-array' as any
    } as any);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('riskScore must be a number between 0 and 100.');
    expect(result.errors).toContain('confidence must be a number between 0.0 and 1.0.');
    expect(result.errors).toContain('emergency must be a boolean.');
    expect(result.errors).toContain('clinicalSummary is required.');
    expect(result.errors).toContain('recommendations must be an array of strings.');
    expect(result.errors).toContain('reasoning must be an array of strings.');
  });
});