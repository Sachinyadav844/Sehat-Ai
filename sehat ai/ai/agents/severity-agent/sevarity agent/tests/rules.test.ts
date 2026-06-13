import { describe, expect, it } from 'vitest';
import { emergencyIndicators, highRiskIndicators, moderateRiskIndicators, lowRiskIndicators } from '../src/rules';

describe('Rules Export', () => {
  it('exports rule indicator arrays', () => {
    expect(Array.isArray(emergencyIndicators)).toBe(true);
    expect(Array.isArray(highRiskIndicators)).toBe(true);
    expect(Array.isArray(moderateRiskIndicators)).toBe(true);
    expect(Array.isArray(lowRiskIndicators)).toBe(true);
    expect(emergencyIndicators).toContain('chest pain');
  });
});
