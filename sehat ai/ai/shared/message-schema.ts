export type AgentEventType =
  | "agent_started"
  | "agent_completed"
  | "risk_detected"
  | "emergency_detected"
  | "report_generated"
  | "appointment_created"
  | "audit_logged";

export interface DashboardEvent {
  type: AgentEventType;
  sourceAgent: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface AgentDecisionRecord {
  agentName: string;
  action: string;
  result: Record<string, unknown>;
  confidence: number;
  timestamp: string;
}

export interface AgentMessage {
  agent: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}
