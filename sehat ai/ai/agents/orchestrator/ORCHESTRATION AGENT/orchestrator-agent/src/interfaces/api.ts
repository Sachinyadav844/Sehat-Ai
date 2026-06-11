import { Request } from "express";
import { WorkflowInput, WorkflowResult } from "./workflow";

export interface AppRequest extends Request {
  body: unknown;
}

export interface AppResponse {
  json: (body: unknown) => void;
}

export interface ProcessRequest {
  sessionId: string;
  conversationId: string;
  language: string;
  input: string;
  metadata?: Record<string, unknown>;
}

export interface WorkflowStartRequest {
  sessionId: string;
  conversationId: string;
  language: string;
  input: string;
}

export interface WorkflowContinueRequest {
  workflowId: string;
  input: string;
}

export interface WorkflowSummaryResponse extends WorkflowResult {}
