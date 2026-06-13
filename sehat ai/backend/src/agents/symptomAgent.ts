export class SymptomAgent {
  async run({ text, language }: { text: string; language?: string }) {
    // Lightweight rule-based extraction as a safe default before RAG/LLM
    const symptoms = [] as any[];
    const lowered = (text || '').toLowerCase();
    if (lowered.includes('fever')) symptoms.push({ name: 'fever' });
    if (lowered.includes('cough')) symptoms.push({ name: 'cough' });
    if (lowered.includes('chest pain')) symptoms.push({ name: 'chest pain' });
    if (lowered.length === 0) symptoms.push({ name: 'unspecified' });
    return { symptoms, language };
  }
}
