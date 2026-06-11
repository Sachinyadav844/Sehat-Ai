export interface WorkflowInput {
  sessionId: string;
  conversationId: string;
  language: string;
  input: string;
  metadata?: Record<string, unknown>;
}

export interface WorkflowStep {
  name: string;
  agentId: string;
  description: string;
}

export interface WorkflowDefinition {
  id: string;
  steps: WorkflowStep[];
}

import type { UnifiedResponse } from "./response";

export interface WorkflowHistoryEntry {
  timestamp: string;
  state: string;
  activeAgent?: string;
  output?: string;
  details?: Record<string, unknown>;
}

export interface WorkflowResult {
  workflowId: string;
  sessionId: string;
  conversationId: string;
  language: string;
  workflowStatus: string;
  activeAgent?: string;
  workflowHistory: WorkflowHistoryEntry[];
  response?: Record<string, unknown> | UnifiedResponse;
  emergencyDetected?: boolean;
}
