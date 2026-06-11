import { ConversationRecord } from "../interfaces/state";

export class ConversationStore {
  private conversations = new Map<string, ConversationRecord>();

  public create(conversationId: string, sessionId: string, language: string): ConversationRecord {
    const record: ConversationRecord = {
      conversationId,
      sessionId,
      language,
      messages: [],
    };
    this.conversations.set(conversationId, record);
    return record;
  }

  public appendMessage(conversationId: string, role: string, content: string): ConversationRecord | undefined {
    const record = this.conversations.get(conversationId);
    if (!record) {
      return undefined;
    }
    const updated = { ...record, messages: [...record.messages, { role, content, timestamp: new Date().toISOString() }] };
    this.conversations.set(conversationId, updated);
    return updated;
  }

  public get(conversationId: string): ConversationRecord | undefined {
    return this.conversations.get(conversationId);
  }

  public delete(conversationId: string): boolean {
    return this.conversations.delete(conversationId);
  }

  public findBySession(sessionId: string): ConversationRecord[] {
    return Array.from(this.conversations.values()).filter((c) => c.sessionId === sessionId);
  }
}
