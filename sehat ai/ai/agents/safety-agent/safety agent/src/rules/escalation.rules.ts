import {EscalationLevel} from '../types';
import {ConfidenceCategory} from './confidence.rules';

export function resolveEscalation(
  emergency: boolean,
  confidenceCategory: ConfidenceCategory,
  consistencyFailed: boolean,
  hallucinationDetected: boolean,
  blockedRecommendationsCount: number
): EscalationLevel {
  if (emergency) {
    return 'EMERGENCY_ESCALATION';
  }

  if (hallucinationDetected || consistencyFailed) {
    return 'DOCTOR_REVIEW';
  }

  if (confidenceCategory === 'CAUTION' || blockedRecommendationsCount > 0) {
    return 'CAUTION';
  }

  return 'NO_ESCALATION';
}
