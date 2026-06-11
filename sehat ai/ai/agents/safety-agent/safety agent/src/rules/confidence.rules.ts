export const confidenceThresholds = {
  approved: 0.85,
  caution: 0.6
};

export type ConfidenceCategory = 'APPROVED' | 'CAUTION' | 'LOW';

export function classifyConfidence(value: number): ConfidenceCategory {
  if (value >= confidenceThresholds.approved) {
    return 'APPROVED';
  }
  if (value >= confidenceThresholds.caution) {
    return 'CAUTION';
  }
  return 'LOW';
}
