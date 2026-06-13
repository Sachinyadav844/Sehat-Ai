export interface SymptomAgentInput {
  text: string;
  language: string;
  history: string[];
}

export interface SymptomProfile {
  symptoms: string[];
  duration?: string;
  severity?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  medicalHistory?: string;
  medicineHistory?: string;
  allergies?: string[];
  lifestyleFactors?: string[];
  familyHistory?: string[];
  disease?: string;
  confidence: number;
}
