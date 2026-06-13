export class SeverityAgent {
  async run({ symptoms }: { symptoms: any }) {
    // Simple heuristic risk scoring
    const names = (symptoms.symptoms || []).map((s: any) => s.name);
    let score = 0;
    if (names.includes('chest pain')) score += 90;
    if (names.includes('fever')) score += 20;
    if (names.includes('cough')) score += 10;
    const level = score >= 80 ? 'critical' : score >= 40 ? 'high' : score >= 15 ? 'medium' : 'low';
    return { riskScore: Math.min(100, score), level, confidence: 0.85 };
  }
}
