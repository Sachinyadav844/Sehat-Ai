import symptomWeightDataset from '../datasets/symptom-risk/symptom-weights';

export const scoreSymptom = (symptom: string): number => {
  const normalized = symptom.trim().toLowerCase();
  const weight = symptomWeightDataset[normalized];
  return weight ?? 5;
};

export const scoreSymptoms = (symptoms: string[]): { score: number; matched: string[]; unmatched: string[] } => {
  const matched: string[] = [];
  const unmatched: string[] = [];
  let score = 0;

  symptoms.forEach((symptom) => {
    const normalized = symptom.trim().toLowerCase();
    const weight = scoreSymptom(symptom);
    if (symptomWeightDataset[normalized]) {
      matched.push(symptom);
    } else {
      unmatched.push(symptom);
    }
    score += weight;
  });

  return { score, matched, unmatched };
};
