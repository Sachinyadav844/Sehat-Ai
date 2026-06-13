export const calculateConfidence = (matchedSymptoms: number, providedSymptoms: number, requestQuality: number, guidelineCoverage: number): number => {
  const completeness = providedSymptoms > 0 ? Math.min(matchedSymptoms / providedSymptoms, 1) : 0;
  const normalizedQuality = Math.min(Math.max(requestQuality, 0), 1);
  const normalizedCoverage = Math.min(Math.max(guidelineCoverage, 0), 1);

  const score = (completeness * 0.4) + (normalizedQuality * 0.3) + (normalizedCoverage * 0.3);
  return Math.round(Math.max(0, Math.min(score, 1)) * 100) / 100;
};

export const computeRequestQuality = (payload: Record<string, unknown>): number => {
  const required = ['sessionId', 'symptoms', 'duration', 'age', 'gender', 'language'];
  const present = required.filter((field) => payload[field] != null).length;
  return present / required.length;
};
