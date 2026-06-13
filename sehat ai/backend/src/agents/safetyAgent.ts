export class SafetyAgent {
  async run({ text, symptoms, risk }: { text: string; symptoms: any; risk: any }) {
    // Basic safety rules
    const lowered = (text || '').toLowerCase();
    const criticalKeywords = ['chest pain', 'shortness of breath', 'sudden weakness', 'suicid'];
    const matches = criticalKeywords.filter(k => lowered.includes(k));
    if (matches.length) {
      return { escalate: true, message: `Emergency keywords detected: ${matches.join(', ')}` };
    }
    if (risk && risk.level === 'critical') {
      return { escalate: true, message: 'High clinical risk detected' };
    }
    return { escalate: false, message: 'ok' };
  }
}
