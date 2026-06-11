import { MemoryClient } from '../../../../../shared/memory-client.js';
import { env } from '../config/env.js';
import type { SessionMemoryData } from '../models/symptom.types.js';
import { symptomSummarySchema } from '../models/symptom.types.js';

const createInitialSession = (sessionId: string, language: string): SessionMemoryData => ({
  sessionId,
  language,
  conversationStage: 'start',
  emergencySignals: false,
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  history: [],
});

class SessionMemoryAdapter {
  private store = new Map<string, SessionMemoryData>();
  private memoryClient?: MemoryClient;

  constructor() {
    if (env.redisUrl) {
      this.memoryClient = new MemoryClient(env.redisUrl);
    }
  }

  async createSession(sessionId: string, language: string) {
    const session = createInitialSession(sessionId, language);
    await this.save(sessionId, session);
    return session;
  }

  async getSession(sessionId: string) {
    const value = await this.read(sessionId);
    return value || null;
  }

  async updateSession(sessionId: string, updates: Partial<SessionMemoryData>) {
    const existing = await this.getSession(sessionId);
    if (!existing) {
      return null;
    }
    const updated: SessionMemoryData = {
      ...existing,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    if (updates.latestSummary && updates.latestSummary.primarySymptoms.length < 1) {
      delete updated.latestSummary;
    }
    await this.save(sessionId, updated);
    return updated;
  }

  async clearSession(sessionId: string) {
    await this.deleteKey(sessionId);
    this.store.delete(sessionId);
    return true;
  }

  async appendHistory(sessionId: string, role: 'patient' | 'agent', text: string) {
    const session = await this.getSession(sessionId);
    if (!session) {
      return null;
    }
    session.history.push({ role, text });
    session.lastUpdated = new Date().toISOString();
    await this.save(sessionId, session);
    return session;
  }

  private getKeyName(sessionId: string) {
    return `session:${sessionId}`;
  }

  private async save(sessionId: string, payload: SessionMemoryData) {
    const key = this.getKeyName(sessionId);
    if (this.memoryClient) {
      await this.memoryClient.setKey(key, payload, env.sessionTtl);
      return;
    }
    this.store.set(key, payload);
  }

  private async read(sessionId: string) {
    const key = this.getKeyName(sessionId);
    if (this.memoryClient) {
      const data = await this.memoryClient.getKey<SessionMemoryData>(key);
      return data;
    }
    return this.store.get(key) || null;
  }

  private async deleteKey(sessionId: string) {
    const key = this.getKeyName(sessionId);
    if (this.memoryClient) {
      await this.memoryClient.deleteKey(key);
    }
  }
}

export const sessionMemory = new SessionMemoryAdapter();
