import request from 'supertest';
import app from '../src/api/app';
import {SafetyEngine} from '../src/core/safety-engine';

describe('Safety Agent core rules', () => {
  const engine = new SafetyEngine();

  it('detects emergency from chest pain and breathing difficulty', () => {
    const result = engine.evaluateSafety({
      sessionId: 'test-1',
      symptoms: ['chest pain', 'breathing difficulty'],
      severityResult: {riskLevel: 'MEDIUM', riskScore: 55, confidence: 0.78},
      recommendations: ['Seek emergency care']
    });

    expect(result.emergency).toBe(true);
    expect(result.riskLevel).toBe('EMERGENCY');
    expect(result.escalationLevel).toBe('EMERGENCY_ESCALATION');
    expect(result.safe).toBe(false);
  });

  it('blocks unsafe recommendations and flags unsupported advice', () => {
    const result = engine.evaluateSafety({
      sessionId: 'test-2',
      symptoms: ['headache'],
      severityResult: {riskLevel: 'LOW', riskScore: 20, confidence: 0.9},
      recommendations: ['Ignore severe chest pain']
    });

    expect(result.blockedRecommendations).toContain('Ignore severe chest pain');
    expect(result.hallucinationDetected).toBe(true);
    expect(result.escalationLevel).toBe('DOCTOR_REVIEW');
    expect(result.safe).toBe(false);
  });

  it('assigns caution for mid-range confidence', () => {
    const result = engine.evaluateSafety({
      sessionId: 'test-3',
      symptoms: ['cough'],
      severityResult: {riskLevel: 'MEDIUM', riskScore: 45, confidence: 0.72},
      recommendations: ['Rest']
    });

    expect(result.riskLevel).toBe('CAUTION');
    expect(result.escalationLevel).toBe('CAUTION');
    expect(result.safe).toBe(false);
  });

  it('returns safe when all inputs are consistent and approved', () => {
    const result = engine.evaluateSafety({
      sessionId: 'test-4',
      symptoms: ['fever', 'cough'],
      severityResult: {riskLevel: 'LOW', riskScore: 25, confidence: 0.9},
      recommendations: ['Rest', 'Hydration']
    });

    expect(result.safe).toBe(true);
    expect(result.riskLevel).toBe('SAFE');
    expect(result.escalationLevel).toBe('NO_ESCALATION');
  });

  it('handles malformed inputs without crashing', () => {
    const result = engine.evaluateSafety({
      sessionId: 'test-5',
      symptoms: [''],
      severityResult: {riskLevel: 'INVALID' as any, riskScore: -5, confidence: 1.4},
      recommendations: ['']
    });

    expect(result.safe).toBe(false);
    expect(result.validationErrors).toBeDefined();
    expect(result.escalationLevel).toBe('DOCTOR_REVIEW');
  });
});

describe('Safety Agent HTTP API', () => {
  it('returns healthy status on /health', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({service: 'safety-agent', status: 'healthy'});
  });

  it('provides emergency rules on /emergency-rules', async () => {
    const response = await request(app).get('/emergency-rules');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.emergencySymptoms)).toBe(true);
  });

  it('evaluates safety via POST /safety/evaluate', async () => {
    const response = await request(app).post('/safety/evaluate').send({
      sessionId: 'api-1',
      symptoms: ['chest pain', 'shortness of breath'],
      severityResult: {riskLevel: 'HIGH', riskScore: 82, confidence: 0.91},
      recommendations: ['Monitor symptoms']
    });

    expect(response.status).toBe(200);
    expect(response.body.emergency).toBe(true);
    expect(response.body.escalationRequired).toBe(true);
    expect(response.body.blockedRecommendations).toBeDefined();
  });

  it('rejects malformed payloads without crashing', async () => {
    const response = await request(app).post('/safety/evaluate').send({bad: 'payload'});
    expect(response.status).toBe(200);
    expect(response.body.safe).toBe(false);
    expect(response.body.escalationLevel).toBe('DOCTOR_REVIEW');
  });
});
