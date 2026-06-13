import { describe, expect, it } from 'vitest';
import { analyzeSeverity } from '../src/index';

const baseRequest = {
  sessionId: 'test-1',
  symptoms: ['fever', 'cough'],
  duration: '3 days',
  age: 32,
  gender: 'male',
  language: 'en'
};

describe('Severity Agent Core', () => {
  it('returns LOW risk for mild symptoms', async () => {
    const response = await analyzeSeverity({
      ...baseRequest,
      symptoms: ['headache', 'fatigue'],
      duration: '1 day'
    });

    expect(response.riskLevel).toBe('LOW');
    expect(response.riskScore).toBeLessThanOrEqual(25);
    expect(response.emergency).toBe(false);
    expect(response.confidence).toBeGreaterThanOrEqual(0);
    expect(response.confidence).toBeLessThanOrEqual(1);
  });

  it('returns MODERATE risk for fever and cough', async () => {
    const response = await analyzeSeverity(baseRequest);

    expect(response.riskLevel).toBe('MODERATE');
    expect(response.riskScore).toBeGreaterThanOrEqual(26);
    expect(response.riskScore).toBeLessThanOrEqual(60);
    expect(response.emergency).toBe(false);
  });

  it('returns HIGH risk for severe non-emergency symptoms', async () => {
    const response = await analyzeSeverity({
      ...baseRequest,
      symptoms: ['persistent fever', 'vomiting', 'shortness of breath'],
      duration: '1 day',
      age: 35
    });

    expect(response.riskLevel).toBe('HIGH');
    expect(response.riskScore).toBeGreaterThanOrEqual(61);
    expect(response.riskScore).toBeLessThanOrEqual(85);
    expect(response.emergency).toBe(false);
  });

  it('returns EMERGENCY for chest pain and shortness of breath', async () => {
    const response = await analyzeSeverity({
      ...baseRequest,
      symptoms: ['chest pain', 'shortness of breath'],
      duration: '2 days',
      age: 45
    });

    expect(response.riskLevel).toBe('EMERGENCY');
    expect(response.riskScore).toBeGreaterThanOrEqual(86);
    expect(response.emergency).toBe(true);
  });

  it('returns EMERGENCY for emergency symptoms', async () => {
    const response = await analyzeSeverity({
      ...baseRequest,
      symptoms: ['chest pain', 'unconsciousness'],
      duration: '1 day',
      age: 55
    });

    expect(response.emergency).toBe(true);
    expect(response.riskLevel).toBe('EMERGENCY');
    expect(response.riskScore).toBeGreaterThanOrEqual(86);
  });

  it('applies age adjustment with older adult multiplier', async () => {
    const response = await analyzeSeverity({
      ...baseRequest,
      symptoms: ['fever', 'cough', 'fatigue'],
      duration: '5 days',
      age: 72
    });

    expect(response.riskScore).toBeGreaterThan(35);
    expect(response.riskLevel).not.toBe('LOW');
  });

  it('applies duration adjustment for extended symptoms', async () => {
    const response = await analyzeSeverity({
      ...baseRequest,
      symptoms: ['fever', 'cough'],
      duration: '14 days',
      age: 30
    });

    expect(response.riskScore).toBeGreaterThan(40);
    expect(response.recommendations.length).toBeGreaterThan(0);
  });

  it('throws for invalid payload', async () => {
    await expect(analyzeSeverity({
      symptoms: ['fever'],
      duration: '1 day',
      age: 30,
      gender: 'male',
      language: 'en'
    } as any)).rejects.toThrow('Invalid input');
  });
});
