export interface MemoryRecord {
  sessionId: string;
  conversationId?: string;
  type: "short-term" | "long-term" | "conversation" | "patient";
  payload: Record<string, unknown>;
  updatedAt: string;
}

export class MemoryManager {
  private records: MemoryRecord[] = [];

  public store(record: Omit<MemoryRecord, "updatedAt">): MemoryRecord {
    const item: MemoryRecord = { ...record, updatedAt: new Date().toISOString() };
    this.records.push(item);
    return item;
  }

  public query(filter: Partial<MemoryRecord>): MemoryRecord[] {
    return this.records.filter((record) => {
      return Object.entries(filter).every(([key, value]) => {
        const r = record as unknown as Record<string, unknown>;
        return r[key] === value;
      });
    });
  }

  public clearSession(sessionId: string): void {
    this.records = this.records.filter((record) => record.sessionId !== sessionId);
  }
}
