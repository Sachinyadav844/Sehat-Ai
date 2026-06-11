export interface AgentMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  capabilities: string[];
}

export interface AgentExecutePayload {
  sessionId: string;
  conversationId: string;
  language: string;
  input: string;
  context?: Record<string, unknown>;
}

export interface AgentExecuteResult {
  success: boolean;
  output: string;
  data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AgentHealthStatus {
  healthy: boolean;
  details: string;
}

export interface Agent {
  execute(payload: AgentExecutePayload): Promise<AgentExecuteResult>;
  healthCheck(): Promise<AgentHealthStatus>;
  metadata(): AgentMetadata;
}
