import emergencySymptoms from '../datasets/emergency-symptoms/emergency-symptoms';

export const isEmergencySymptom = (symptom: string): boolean => {
  const normalized = symptom.trim().toLowerCase();
  return emergencySymptoms.some((item) => item.toLowerCase() === normalized);
};

export const collectEmergencySymptoms = (symptoms: string[]): string[] => {
  return symptoms.filter(isEmergencySymptom);
};
