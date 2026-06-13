import { SeverityRequest, SeverityResponse } from '../interfaces/severity.interface';
import { collectEmergencySymptoms } from '../scoring/emergency-scorer';
import { scoreSymptoms } from '../scoring/symptom-scorer';
import { calculateAgeMultiplier, calculateDurationImpact, calculateRisk } from './risk-calculator';
import { calculateConfidence, computeRequestQuality } from './confidence-engine';
import { validateSeverityRequest } from '../validators/symptom.validator';
import { validateSeverityResponse } from '../validators/severity.validator';
import { emergencyIndicators, highRiskIndicators, moderateRiskIndicators, lowRiskIndicators } from '../rules';
import { logEvent } from '../logging';

const buildClinicalSummary = (riskLevel: string, emergency: boolean): string => {
  if (emergency) {
    return 'Immediate emergency care recommended due to high-risk symptoms.';
  }
  if (riskLevel === 'HIGH') {
    return 'Symptoms indicate a high risk clinical state requiring prompt assessment.';
  }
  if (riskLevel === 'MODERATE') {
    return 'Symptoms suggest moderate illness that should be monitored closely.';
  }
  return 'Symptoms are currently consistent with a low risk condition.';
};

const buildRecommendations = (riskLevel: string, emergency: boolean): string[] => {
  if (emergency) {
    return [
      'Call emergency services immediately.',
      'Do not delay treatment for severe symptoms.'
    ];
  }
  if (riskLevel === 'HIGH') {
    return [
      'Arrange a clinical review as soon as possible.',
      'Monitor vital signs and symptom progression.'
    ];
  }
  if (riskLevel === 'MODERATE') {
    return [
      'Monitor symptoms closely for 24-48 hours.',
      'Seek consultation if symptoms worsen.'
    ];
  }
  return [
    'Continue self-care and monitor symptoms.',
    'Seek medical advice if new symptoms develop.'
  ];
};

const countGuidelineCoverage = (symptoms: string[]): number => {
  const normalized = symptoms.map((symptom) => symptom.trim().toLowerCase());
  const coverage = new Set<string>();

  [...lowRiskIndicators, ...moderateRiskIndicators, ...highRiskIndicators, ...emergencyIndicators].forEach((indicator) => {
    if (normalized.some((symptom) => symptom.includes(indicator))) {
      coverage.add(indicator);
    }
  });

  return Math.min(coverage.size / 6, 1);
};

export const analyzeSeverity = async (payload: unknown): Promise<SeverityResponse> => {
  logEvent('Analysis Started', { payload });
  const validation = validateSeverityRequest(payload);
  if (!validation.valid) {
    logEvent('Errors', { validationErrors: validation.errors });
    throw new Error(`Invalid input: ${validation.errors.join('; ')}`);
  }

  const request = payload as SeverityRequest;
  const normalizedSymptoms = request.symptoms.map((symptom) => symptom.trim()).filter(Boolean);
  const emergencySymptoms = collectEmergencySymptoms(normalizedSymptoms);
  const { score: baseScore, matched, unmatched } = scoreSymptoms(normalizedSymptoms);
  const durationImpact = calculateDurationImpact(request.duration);
  const ageMultiplier = calculateAgeMultiplier(request.age);
  const emergencyDetected = emergencySymptoms.length > 0;

  const { riskScore, riskLevel } = calculateRisk(baseScore, durationImpact, ageMultiplier, emergencyDetected);
  const confidence = calculateConfidence(matched.length, normalizedSymptoms.length, computeRequestQuality(request), countGuidelineCoverage(normalizedSymptoms));

  const reasoning = [
    ...(emergencyDetected ? ['Emergency symptoms identified, escalation required.'] : []),
    ...(durationImpact > 0 ? [`Duration impact detected: ${durationImpact} points.`] : []),
    ...(riskLevel === 'HIGH' ? ['High-risk symptoms or combinations detected.'] : []),
    ...(riskLevel === 'MODERATE' ? ['Moderate symptoms require monitoring.'] : []),
    ...(unmatched.length > 0 ? [`Some symptoms were not matched to known clinical weights: ${unmatched.join(', ')}.`] : [])
  ];

  const response: SeverityResponse = {
    riskLevel,
    riskScore,
    confidence,
    emergency: emergencyDetected,
    clinicalSummary: buildClinicalSummary(riskLevel, emergencyDetected),
    recommendations: buildRecommendations(riskLevel, emergencyDetected),
    reasoning
  };

  const responseValidation = validateSeverityResponse(response);
  if (!responseValidation.valid) {
    logEvent('Errors', { responseValidationErrors: responseValidation.errors });
    throw new Error(`Invalid response generated: ${responseValidation.errors.join('; ')}`);
  }

  logEvent('Risk Calculated', { riskLevel, riskScore, emergency: emergencyDetected });
  logEvent('Response Generated', { response });
  return response;
};
