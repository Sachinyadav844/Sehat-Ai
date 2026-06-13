import {MedicalSafetyKnowledgeProvider} from '../types/rag';

export class MedicalSafetyKnowledgeProviderStub implements MedicalSafetyKnowledgeProvider {
  async searchSafetyRules(): Promise<unknown> {
    return Promise.resolve({message: 'Knowledge provider interface ready for future RAG integration.'});
  }

  async searchGuidelines(): Promise<unknown> {
    return Promise.resolve({message: 'Guideline search interface ready for future RAG integration.'});
  }
}
