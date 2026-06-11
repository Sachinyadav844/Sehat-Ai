import contraindications from '../../datasets/contraindications/index.json';

export interface RecommendationValidationResult {
  approvedRecommendations: string[];
  blockedRecommendations: string[];
  unsupportedRecommendations: string[];
  warnings: string[];
}

const allowedRecommendations = [
  'consult doctor',
  'monitor symptoms',
  'seek emergency care',
  'hydration',
  'rest',
  'follow-up'
];

const blockedPatterns = contraindications.map((entry) => entry.toLowerCase());

function normalizeRecommendation(recommendation: string): string {
  return recommendation.trim().toLowerCase();
}

export function validateRecommendations(recommendations: unknown): RecommendationValidationResult {
  const result: RecommendationValidationResult = {
    approvedRecommendations: [],
    blockedRecommendations: [],
    unsupportedRecommendations: [],
    warnings: []
  };

  if (!Array.isArray(recommendations)) {
    result.warnings.push('Recommendations must be an array.');
    return result;
  }

  recommendations.forEach((recommendation) => {
    if (typeof recommendation !== 'string' || recommendation.trim().length === 0) {
      result.blockedRecommendations.push(String(recommendation));
      result.warnings.push('Empty or malformed recommendation blocked.');
      return;
    }

    const normalized = normalizeRecommendation(recommendation);
    const containsUnsafe = blockedPatterns.some((pattern) => normalized.includes(pattern));
    if (containsUnsafe) {
      result.blockedRecommendations.push(recommendation);
      result.warnings.push(`Blocked unsafe recommendation: ${recommendation}`);
      return;
    }

    if (allowedRecommendations.includes(normalized)) {
      result.approvedRecommendations.push(recommendation);
      return;
    }

    result.unsupportedRecommendations.push(recommendation);
    result.blockedRecommendations.push(recommendation);
    result.warnings.push(`Unsupported recommendation detected: ${recommendation}`);
  });

  return result;
}
