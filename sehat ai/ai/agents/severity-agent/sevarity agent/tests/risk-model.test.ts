import { describe, expect, it } from 'vitest';
import { getRiskLevelForScore } from '../src/models/risk.model';

describe('Risk Model', () => {
  it('returns LOW for low score thresholds', () => {
    expect(getRiskLevelForScore(0)).toBe('LOW');
    expect(getRiskLevelForScore(25)).toBe('LOW');
  });

  it('returns MODERATE for moderate score thresholds', () => {
    expect(getRiskLevelForScore(26)).toBe('MODERATE');
    expect(getRiskLevelForScore(60)).toBe('MODERATE');
  });

  it('returns HIGH for high score thresholds', () => {
    expect(getRiskLevelForScore(61)).toBe('HIGH');
    expect(getRiskLevelForScore(85)).toBe('HIGH');
  });

  it('returns EMERGENCY for top score thresholds', () => {
    expect(getRiskLevelForScore(86)).toBe('EMERGENCY');
    expect(getRiskLevelForScore(100)).toBe('EMERGENCY');
  });
});
