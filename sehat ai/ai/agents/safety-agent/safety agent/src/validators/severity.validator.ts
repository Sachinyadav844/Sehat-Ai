export interface SeverityValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateSeverity(severity: unknown): SeverityValidationResult {
  const errors: string[] = [];

  if (typeof severity !== 'object' || severity === null) {
    return {valid: false, errors: ['Missing or malformed severityResult object.']};
  }

  const candidate = severity as Record<string, unknown>;
  const riskLevel = candidate.riskLevel;
  const riskScore = candidate.riskScore;
  const confidence = candidate.confidence;

  const allowedRiskLevels = ['LOW', 'MEDIUM', 'HIGH'];

  if (typeof riskLevel !== 'string' || !allowedRiskLevels.includes(riskLevel)) {
    errors.push('severityResult.riskLevel must be one of LOW, MEDIUM, HIGH.');
  }

  if (typeof riskScore !== 'number' || riskScore < 0 || riskScore > 100) {
    errors.push('severityResult.riskScore must be a number between 0 and 100.');
  }

  if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
    errors.push('severityResult.confidence must be a number between 0 and 1.');
  }

  return {valid: errors.length === 0, errors};
}
