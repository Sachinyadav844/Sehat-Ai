import {SafetyInput, SafetyOutput} from '../interfaces/safety';
import {validatePayload} from './validation-engine';
import {CoreEmergencyEngine} from './emergency-engine';
import {CoreEscalationEngine} from './escalation-engine';
import {analyzeConfidence} from '../confidence/confidence-engine';
import {validateRecommendations} from '../validators/recommendation.validator';
import {detectHallucination} from '../hallucination/hallucination-detector';
import {SafetyLevel} from '../types';
import {clinicalSafetyRules} from '../rules/safety.rules';

export class SafetyEngine {
  private emergencyEngine = new CoreEmergencyEngine();
  private escalationEngine = new CoreEscalationEngine();

  evaluateSafety(payload: unknown): SafetyOutput {
    const validation = validatePayload(payload);
    const warnings: string[] = [];
    warnings.push(...validation.warnings);

    if (!validation.valid) {
      return {
        safe: false,
        emergency: false,
        escalationRequired: true,
        confidence: 0,
        riskLevel: 'UNSAFE',
        safetyWarnings: validation.errors,
        approvedRecommendations: [],
        blockedRecommendations: [],
        hallucinationDetected: false,
        consistencyFailed: false,
        escalationLevel: 'DOCTOR_REVIEW',
        validationErrors: validation.errors
      };
    }

    const input = payload as SafetyInput;
    const recommendationResult = validateRecommendations(input.recommendations);
    const emergencyResult = this.emergencyEngine.detect(input.symptoms, input.severityResult);
    const confidenceResult = analyzeConfidence(input.severityResult.confidence, emergencyResult.emergency);
    const consistencyFailed = this.evaluateConsistency(input);
    const hallucinationResult = detectHallucination(
      input.symptoms,
      input.severityResult,
      recommendationResult.approvedRecommendations,
      recommendationResult.blockedRecommendations
    );
    const escalationLevel = this.escalationEngine.decide(
      emergencyResult.emergency,
      confidenceResult.category,
      consistencyFailed,
      hallucinationResult.hallucinationDetected,
      recommendationResult.blockedRecommendations.length
    );

    const finalSafetyLevel = this.resolveSafetyLevel(
      emergencyResult.emergency,
      consistencyFailed,
      hallucinationResult.hallucinationDetected,
      recommendationResult.blockedRecommendations.length,
      escalationLevel
    );

    const safe = !emergencyResult.emergency && !consistencyFailed && !hallucinationResult.hallucinationDetected && recommendationResult.blockedRecommendations.length === 0 && escalationLevel === 'NO_ESCALATION';

    const safetyWarnings = [
      ...warnings,
      ...emergencyResult.reasons,
      ...recommendationResult.warnings,
      ...hallucinationResult.issues
    ];

    return {
      safe,
      emergency: emergencyResult.emergency,
      escalationRequired: escalationLevel !== 'NO_ESCALATION',
      confidence: confidenceResult.confidence,
      riskLevel: finalSafetyLevel,
      safetyWarnings,
      approvedRecommendations: recommendationResult.approvedRecommendations,
      blockedRecommendations: recommendationResult.blockedRecommendations,
      hallucinationDetected: hallucinationResult.hallucinationDetected,
      consistencyFailed,
      escalationLevel
    };
  }

  private resolveSafetyLevel(
    emergency: boolean,
    consistencyFailed: boolean,
    hallucinationDetected: boolean,
    blockedRecommendationsCount: number,
    escalationLevel: string
  ): SafetyLevel {
    if (emergency) {
      return 'EMERGENCY';
    }
    if (consistencyFailed || hallucinationDetected || blockedRecommendationsCount > 0 || escalationLevel === 'DOCTOR_REVIEW') {
      return 'UNSAFE';
    }
    if (escalationLevel === 'CAUTION') {
      return 'CAUTION';
    }
    return 'SAFE';
  }

  private evaluateConsistency(input: SafetyInput): boolean {
    const normalizedSymptoms = input.symptoms.map((symptom) => symptom.toLowerCase());
    const lowRiskEmergencySignals = ['chest pain', 'breathing difficulty', 'shortness of breath', 'unconsciousness', 'stroke', 'anaphylaxis'];

    if (input.severityResult.riskLevel === 'LOW' && normalizedSymptoms.some((value) => lowRiskEmergencySignals.some((signal) => value.includes(signal)))) {
      return true;
    }

    const highRiskMismatch = input.severityResult.riskLevel === 'HIGH' && normalizedSymptoms.every((value) => !value.match(/chest pain|stroke|breathing difficulty|unconsciousness|anaphylaxis|severe bleeding|severe trauma/));
    if (highRiskMismatch && input.severityResult.riskScore < 80) {
      return true;
    }

    const matchedRule = clinicalSafetyRules.find((rule) => rule.conditions.some((condition) => normalizedSymptoms.some((value) => value.includes(condition))));
    if (matchedRule && matchedRule.outcome === 'EMERGENCY' && input.severityResult.riskLevel === 'LOW') {
      return true;
    }

    return false;
  }
}
