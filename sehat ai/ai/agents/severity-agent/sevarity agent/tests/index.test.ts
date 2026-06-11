import { describe, expect, it } from 'vitest';
import { analyzeSeverity, createApp } from '../src/index';

const baseRequest = {
  sessionId: 'index-test',
  symptoms: ['fever', 'cough'],
  duration: '3 days',
  age: 32,
  gender: 'male',
  language: 'en'
};

describe('Index exports', () => {
  it('returns the express app from createApp', () => {
    const app = createApp();
    expect(app).toBeDefined();
    expect(typeof app.use).toBe('function');
  });

  it('delegates severity analysis through the exported analyzeSeverity', async () => {
    const response = await analyzeSeverity(baseRequest);
    expect(response.riskLevel).toBeDefined();
    expect(response.riskScore).toBeGreaterThanOrEqual(0);
  });
});