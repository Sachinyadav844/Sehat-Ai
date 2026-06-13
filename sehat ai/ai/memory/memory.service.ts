import Redis from "ioredis";

export interface ConversationRecord {
  consultationId: string;
  messages: Array<{ role: string; text: string; timestamp: string }>;
  metadata?: Record<string, unknown>;
}

export interface SessionRecord {
  sessionId: string;
  userId: string;
  context: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export class MemoryService {
  private client: Redis;

  constructor(redisUrl = process.env.REDIS_URL || "redis://localhost:6379") {
    this.client = new Redis(redisUrl);
  }

  async saveConversation(key: string, conversation: ConversationRecord): Promise<void> {
    await this.client.set(`conversation:${key}`, JSON.stringify(conversation));
  }

  async loadConversation(key: string): Promise<ConversationRecord | null> {
    const payload = await this.client.get(`conversation:${key}`);
    return payload ? JSON.parse(payload) : null;
  }

  async saveSession(sessionId: string, session: SessionRecord): Promise<void> {
    await this.client.set(`session:${sessionId}`, JSON.stringify(session));
  }

  async loadSession(sessionId: string): Promise<SessionRecord | null> {
    const payload = await this.client.get(`session:${sessionId}`);
    return payload ? JSON.parse(payload) : null;
  }

  async clearSession(sessionId: string): Promise<void> {
    await this.client.del(`session:${sessionId}`);
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}
