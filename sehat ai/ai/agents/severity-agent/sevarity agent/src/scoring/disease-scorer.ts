export interface DiseaseScore {
  condition: string;
  severityIndex: number;
}

const diseaseMappings: Record<string, DiseaseScore> = {
  pneumonia: { condition: 'pneumonia', severityIndex: 70 },
  influenza: { condition: 'influenza', severityIndex: 55 },
  infection: { condition: 'infection', severityIndex: 40 }
};

export const scoreDiseaseSignature = (signature: string): DiseaseScore | null => {
  const normalized = signature.trim().toLowerCase();
  return diseaseMappings[normalized] ?? null;
};
