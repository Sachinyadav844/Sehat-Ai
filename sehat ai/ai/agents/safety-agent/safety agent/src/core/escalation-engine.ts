import {EscalationLevel} from '../types';
import {resolveEscalation} from '../rules/escalation.rules';
import {ConfidenceCategory} from '../rules/confidence.rules';

export class CoreEscalationEngine {
  decide(
    emergency: boolean,
    confidenceCategory: ConfidenceCategory,
    consistencyFailed: boolean,
    hallucinationDetected: boolean,
    blockedRecommendationsCount: number
  ): EscalationLevel {
    return resolveEscalation(
      emergency,
      confidenceCategory,
      consistencyFailed,
      hallucinationDetected,
      blockedRecommendationsCount
    );
  }
}
