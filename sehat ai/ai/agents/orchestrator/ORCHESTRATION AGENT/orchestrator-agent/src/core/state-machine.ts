import { EventEmitter } from "events";
import { WorkflowState, WORKFLOW_STATES } from "../constants/workflow.constants";

const TRANSITIONS: Record<WorkflowState, WorkflowState[]> = {
  [WORKFLOW_STATES.IDLE]: [WORKFLOW_STATES.LISTENING],
  [WORKFLOW_STATES.LISTENING]: [WORKFLOW_STATES.SYMPTOM_ANALYSIS, WORKFLOW_STATES.FAILED],
  [WORKFLOW_STATES.SYMPTOM_ANALYSIS]: [WORKFLOW_STATES.KNOWLEDGE_RETRIEVAL, WORKFLOW_STATES.FAILED],
  [WORKFLOW_STATES.KNOWLEDGE_RETRIEVAL]: [WORKFLOW_STATES.SEVERITY_ANALYSIS, WORKFLOW_STATES.FAILED],
  [WORKFLOW_STATES.SEVERITY_ANALYSIS]: [WORKFLOW_STATES.SAFETY_VALIDATION, WORKFLOW_STATES.FAILED],
  [WORKFLOW_STATES.SAFETY_VALIDATION]: [WORKFLOW_STATES.EMERGENCY_CHECK, WORKFLOW_STATES.FAILED],
  [WORKFLOW_STATES.EMERGENCY_CHECK]: [WORKFLOW_STATES.RESPONSE_GENERATION, WORKFLOW_STATES.COMPLETED, WORKFLOW_STATES.FAILED],
  [WORKFLOW_STATES.RESPONSE_GENERATION]: [WORKFLOW_STATES.COMPLETED, WORKFLOW_STATES.FAILED],
  [WORKFLOW_STATES.COMPLETED]: [],
  [WORKFLOW_STATES.FAILED]: [],
};

export class StateMachine extends EventEmitter {
  private currentState: WorkflowState;

  constructor(initialState: WorkflowState = WORKFLOW_STATES.IDLE) {
    super();
    this.currentState = initialState;
  }

  public getState(): WorkflowState {
    return this.currentState;
  }

  public canTransition(nextState: WorkflowState): boolean {
    return TRANSITIONS[this.currentState].includes(nextState);
  }

  public transition(nextState: WorkflowState): boolean {
    if (!this.canTransition(nextState)) {
      return false;
    }
    this.currentState = nextState;
    this.emit("transition", nextState);
    return true;
  }
}
