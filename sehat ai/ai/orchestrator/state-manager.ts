export interface WorkflowState {
  requestId: string;
  stage: string;
  context: Record<string, unknown>;
  startedAt: string;
  updatedAt: string;
}

export class StateManager {
  private state = new Map<string, WorkflowState>();

  create(requestId: string): WorkflowState {
    const payload: WorkflowState = {
      requestId,
      stage: "initialized",
      context: {},
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.state.set(requestId, payload);
    return payload;
  }

  update(requestId: string, partial: Partial<WorkflowState>): WorkflowState | undefined {
    const current = this.state.get(requestId);
    if (!current) return undefined;
    const updated = {
      ...current,
      ...partial,
      updatedAt: new Date().toISOString()
    };
    this.state.set(requestId, updated);
    return updated;
  }

  get(requestId: string): WorkflowState | undefined {
    return this.state.get(requestId);
  }

  delete(requestId: string): void {
    this.state.delete(requestId);
  }
}
