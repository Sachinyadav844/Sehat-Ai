import { AgentExecuteResult } from "../interfaces/agent";

export interface EmergencyEvent extends Record<string, unknown> {
  sessionId: string;
  conversationId: string;
  workflowId: string;
  reason: string;
  detectedAt: string;
}

export class EmergencyHandler {
  public isEmergency(analysis: AgentExecuteResult): boolean {
    const indicator = (analysis.data?.emergencyFlag || false) as boolean;
    return indicator || /emergency|urgent|danger|life-threatening/i.test(analysis.output);
  }

  public createEvent(sessionId: string, conversationId: string, workflowId: string, reason: string): EmergencyEvent {
    return {
      sessionId,
      conversationId,
      workflowId,
      reason,
      detectedAt: new Date().toISOString(),
    };
  }
}
