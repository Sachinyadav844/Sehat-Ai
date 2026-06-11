export interface ConversationRecord {
  conversationId: string;
  sessionId: string;
  language: string;
  messages: Array<{ role: string; content: string; timestamp: string }>;
}

export interface SessionRecord {
  sessionId: string;
  createdAt: string;
  lastUpdatedAt: string;
  language: string;
  metadata: Record<string, unknown>;
}
