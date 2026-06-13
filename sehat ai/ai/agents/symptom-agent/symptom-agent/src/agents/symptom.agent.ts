import { analyzeSymptomsWorkflow } from './workflow.js';

export class SymptomAgent {
  async analyze(options: {
    sessionId: string;
    message: string;
    language: string;
    sessionContext: string;
    history: string;
  }) {
    return analyzeSymptomsWorkflow(options);
  }
}

export const symptomAgent = new SymptomAgent();
