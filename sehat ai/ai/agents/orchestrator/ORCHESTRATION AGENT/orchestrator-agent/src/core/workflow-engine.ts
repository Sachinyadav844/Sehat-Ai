import { WorkflowInput, WorkflowResult, WorkflowHistoryEntry } from "../interfaces/workflow";
import { UnifiedResponse } from "../interfaces/response";
import { WORKFLOW_STATES, WorkflowState } from "../constants/workflow.constants";
import { StateMachine } from "./state-machine";

export class WorkflowEngine {
  private stateMachine: StateMachine;
  private history: WorkflowHistoryEntry[] = [];

  constructor() {
    this.stateMachine = new StateMachine(WORKFLOW_STATES.IDLE);
  }

  public getCurrentState(): WorkflowState {
    return this.stateMachine.getState();
  }

  public transition(state: WorkflowState, details?: Record<string, unknown>, activeAgent?: string): void {
    const transitioned = this.stateMachine.transition(state);
    if (!transitioned) {
      throw new Error(`Invalid workflow transition from ${this.getCurrentState()} to ${state}`);
    }
    this.history.push({
      timestamp: new Date().toISOString(),
      state,
      activeAgent,
      details,
    });
  }

  public buildResult(input: WorkflowInput, response?: Record<string, unknown> | UnifiedResponse, emergencyDetected = false): WorkflowResult {
    const possibleId = this.history[0]?.details && (this.history[0].details as Record<string, unknown>).workflowId;
    const workflowId = typeof possibleId === "string" ? possibleId : String(possibleId ?? "unknown");

    return {
      workflowId,
      sessionId: input.sessionId,
      conversationId: input.conversationId,
      language: input.language,
      workflowStatus: this.getCurrentState(),
      activeAgent: this.history[this.history.length - 1]?.activeAgent,
      workflowHistory: this.history,
      response,
      emergencyDetected,
    };
  }
}
