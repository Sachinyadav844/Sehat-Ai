import { MedicalKnowledgeProvider } from '../interfaces/severity.interface';

export class StaticMedicalKnowledgeProvider implements MedicalKnowledgeProvider {
  async searchSymptoms(_query: string): Promise<string[]> {
    return [];
  }

  async searchGuidelines(_topic: string): Promise<string[]> {
    return [];
  }
}
