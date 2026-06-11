import { MemoryClient } from '../../../../../shared/memory-client.js';
import type { SymptomSummary } from '../models/symptom.types.js';
import { env } from '../config/env.js';

class PatientMemoryAdapter {
  private symptomsBySession = new Map<string, SymptomSummary>();
  private memoryClient?: MemoryClient;

  constructor() {
    if (env.redisUrl) {
      this.memoryClient = new MemoryClient(env.redisUrl);
    }
  }

  async saveSummary(sessionId: string, summary: SymptomSummary) {
    const key = this.getKeyName(sessionId);
    if (this.memoryClient) {
      await this.memoryClient.setKey(key, summary);
      return;
    }
    this.symptomsBySession.set(sessionId, summary);
  }

  async getSummary(sessionId: string) {
    const key = this.getKeyName(sessionId);
    if (this.memoryClient) {
      return this.memoryClient.getKey<SymptomSummary>(key);
    }
    return this.symptomsBySession.get(sessionId) || null;
  }

  async clearSummary(sessionId: string) {
    const key = this.getKeyName(sessionId);
    if (this.memoryClient) {
      await this.memoryClient.deleteKey(key);
      return;
    }
    this.symptomsBySession.delete(sessionId);
  }

  private getKeyName(sessionId: string) {
    return `patient_summary:${sessionId}`;
  }
}

export const patientMemory = new PatientMemoryAdapter();
