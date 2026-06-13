import type { SessionMemoryData } from '../models/symptom.types.js';

export function buildConversationContext(session: SessionMemoryData) {
  const historyLines = session.history.map((entry) => `${entry.role}: ${entry.text}`);
  return historyLines.slice(-10).join('\n');
}
