import { ConversationStore } from "./conversation-store";
import { SessionStore } from "./session-store";

export class StateManager {
  public readonly sessionStore = new SessionStore();
  public readonly conversationStore = new ConversationStore();

  public initializeSession(sessionId: string, language: string, metadata: Record<string, unknown> = {}) {
    return this.sessionStore.create(sessionId, language, metadata);
  }

  public initializeConversation(sessionId: string, conversationId: string, language: string) {
    return this.conversationStore.create(conversationId, sessionId, language);
  }

  public clearSession(sessionId: string): void {
    // remove session record and any related conversations
    this.sessionStore.delete(sessionId);
    const related = this.conversationStore.findBySession(sessionId);
    for (const conv of related) {
      this.conversationStore.delete(conv.conversationId);
    }
  }
}
