import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../src/app';
import { SeverityService } from '../src/core/severity.service';

describe('Severity Agent API', () => {
  it('responds healthy on /health', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ service: 'severity-agent', status: 'healthy' });
  });

  it('returns risk levels on /risk-levels', async () => {
    const response = await request(app).get('/risk-levels');
    expect(response.status).toBe(200);
    expect(response.body.riskLevels).toEqual(['LOW', 'MODERATE', 'HIGH', 'EMERGENCY']);
  });

  it('returns enabled rule sets on /rules', async () => {
    const response = await request(app).get('/rules');
    expect(response.status).toBe(200);
    expect(response.body.enabled).toEqual(['low-risk', 'moderate-risk', 'high-risk', 'emergency']);
  });

  it('returns validation error for malformed payload', async () => {
    const response = await request(app).post('/severity/analyze').send({
      symptoms: ['fever'],
      duration: '1 day',
      age: 30,
      gender: 'male',
      language: 'en'
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('returns severity response for valid request', async () => {
    const response = await request(app).post('/severity/analyze').send({
      sessionId: 'api-test',
      symptoms: ['fever', 'cough'],
      duration: '3 days',
      age: 32,
      gender: 'male',
      language: 'en'
    });

    expect(response.status).toBe(200);
    expect(response.body.riskLevel).toBeDefined();
    expect(response.body.riskScore).toBeGreaterThanOrEqual(0);
    expect(response.body.confidence).toBeGreaterThanOrEqual(0);
  });

  it('returns 500 when analysis service fails', async () => {
    const spy = vi.spyOn(SeverityService.prototype, 'analyzeSeverity').mockRejectedValue(new Error('service failure'));

    const response = await request(app).post('/severity/analyze').send({
      sessionId: 'api-error',
      symptoms: ['fever', 'cough'],
      duration: '1 day',
      age: 30,
      gender: 'male',
      language: 'en'
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to analyze severity.');

    spy.mockRestore();
  });
});
