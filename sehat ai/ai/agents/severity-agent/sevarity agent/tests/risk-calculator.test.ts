import { describe, expect, it } from 'vitest';
import { calculateDurationImpact, calculateAgeMultiplier, calculateRisk, normalizeRiskScore } from '../src/core/risk-calculator';

describe('Risk Calculator', () => {
  it('calculates duration impact correctly', () => {
    expect(calculateDurationImpact('1 day')).toBe(5);
    expect(calculateDurationImpact('4 days')).toBe(12);
    expect(calculateDurationImpact('7 days')).toBe(15);
    expect(calculateDurationImpact('14 days')).toBe(25);
    expect(calculateDurationImpact('2 weeks')).toBe(25);
    expect(calculateDurationImpact('30 days')).toBe(35);
    expect(calculateDurationImpact('unknown')).toBe(5);
  });

  it('calculates age multiplier correctly', () => {
    expect(calculateAgeMultiplier(1)).toBeCloseTo(1.2);
    expect(calculateAgeMultiplier(10)).toBeCloseTo(1.0);
    expect(calculateAgeMultiplier(30)).toBeCloseTo(1.0);
    expect(calculateAgeMultiplier(70)).toBeCloseTo(1.3);
  });

  it('calculates risk levels with normal scoring', () => {
    const result = calculateRisk(10, 5, 1.0, false);
    expect(result.riskScore).toBe(15);
    expect(result.riskLevel).toBe('LOW');
  });

  it('calculates high risk when score is elevated', () => {
    const result = calculateRisk(50, 20, 1.2, false);
    expect(result.riskScore).toBeGreaterThanOrEqual(61);
    expect(result.riskLevel).toBe('HIGH');
  });

  it('forces emergency classification when emergency detected', () => {
    const result = calculateRisk(10, 5, 1.0, true);
    expect(result.emergency).toBeUndefined();
    expect(result.riskLevel).toBe('EMERGENCY');
    expect(result.riskScore).toBeGreaterThanOrEqual(86);
  });

  it('normalizes risk score boundaries', () => {
    expect(normalizeRiskScore(-20)).toBe(0);
    expect(normalizeRiskScore(150)).toBe(100);
  });
});
