import {validateConfidence} from '../validators/confidence.validator';
import {ConfidenceCategory} from '../rules/confidence.rules';

export interface ConfidenceAnalysis {
  confidence: number;
  category: ConfidenceCategory;
}

export function analyzeConfidence(baseConfidence: number, emergencyDetected: boolean): ConfidenceAnalysis {
  const validation = validateConfidence(baseConfidence);
  const adjustedConfidence = emergencyDetected
    ? Math.min(1, validation.confidence + 0.04)
    : validation.confidence;

  return {
    confidence: adjustedConfidence,
    category: validation.category
  };
}
