import { SessionRecord } from "../interfaces/state";

export class SessionStore {
  private sessions = new Map<string, SessionRecord>();

  public create(sessionId: string, language: string, metadata: Record<string, unknown> = {}): SessionRecord {
    const record: SessionRecord = {
      sessionId,
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      language,
      metadata,
    };
    this.sessions.set(sessionId, record);
    return record;
  }

  public update(sessionId: string, metadata: Record<string, unknown>): SessionRecord | undefined {
    const record = this.sessions.get(sessionId);
    if (!record) {
      return undefined;
    }
    const updated = { ...record, metadata: { ...record.metadata, ...metadata }, lastUpdatedAt: new Date().toISOString() };
    this.sessions.set(sessionId, updated);
    return updated;
  }

  public get(sessionId: string): SessionRecord | undefined {
    return this.sessions.get(sessionId);
  }

  public delete(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }
}
