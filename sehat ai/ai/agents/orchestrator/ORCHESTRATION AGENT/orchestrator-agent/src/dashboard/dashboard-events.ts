import { WORKFLOW_EVENTS } from "../constants/events.constants";

export interface WorkflowEventPayload {
  workflowId?: string;
  sessionId?: string;
  status?: string;
  activeAgent?: string;
  message?: string;
  details?: Record<string, unknown>;
}

export const WORKFLOW_EVENT_MAP = WORKFLOW_EVENTS;
export type WorkflowEventName = typeof WORKFLOW_EVENT_MAP[keyof typeof WORKFLOW_EVENT_MAP];
