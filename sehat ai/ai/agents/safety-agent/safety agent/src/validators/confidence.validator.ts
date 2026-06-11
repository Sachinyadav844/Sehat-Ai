import {classifyConfidence, ConfidenceCategory} from '../rules/confidence.rules';

export interface ConfidenceValidationResult {
  confidence: number;
  category: ConfidenceCategory;
}

export function validateConfidence(value: unknown): ConfidenceValidationResult {
  if (typeof value !== 'number' || value < 0 || value > 1) {
    return {confidence: 0, category: 'LOW'};
  }

  return {confidence: value, category: classifyConfidence(value)};
}
