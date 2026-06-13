export interface MedicalSafetyKnowledgeProvider {
  searchSafetyRules(): Promise<unknown>;
  searchGuidelines(): Promise<unknown>;
}
