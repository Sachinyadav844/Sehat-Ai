import { WorkflowInput, WorkflowResult, WorkflowStep } from "../interfaces/workflow";
import { AgentExecuteResult } from "../interfaces/agent";
import { AgentRouter } from "../agents/agent-router";
import { WorkflowEngine } from "../core/workflow-engine";
import { WorkflowDefinition } from "../interfaces/workflow";
import { ResponseBuilder } from "../response/response-builder";
import { EmergencyHandler } from "../emergency/emergency-handler";
import { WORKFLOW_STATES } from "../constants/workflow.constants";

export class WorkflowRunner {
  private workflowEngine = new WorkflowEngine();
  private responseBuilder = new ResponseBuilder();
  private emergencyHandler = new EmergencyHandler();

  constructor(private readonly agentRouter: AgentRouter) {}

  public async run(definition: WorkflowDefinition, input: WorkflowInput): Promise<WorkflowResult> {
    const results: AgentExecuteResult[] = [];
    let emergencyDetected = false;

    this.workflowEngine.transition(WORKFLOW_STATES.LISTENING, { workflowId: definition.id }, "Orchestrator");

    for (const step of definition.steps) {
      const state = this.getStateForStep(step);
      this.workflowEngine.transition(state, { workflowId: definition.id, step }, step.agentId);
      const result = await this.agentRouter.route(step.agentId, {
        sessionId: input.sessionId,
        conversationId: input.conversationId,
        language: input.language,
        input: input.input,
        context: { step },
      });
      results.push(result);

      if (step.agentId === "SafetyAgent" && this.emergencyHandler.isEmergency(result)) {
        emergencyDetected = true;
        this.workflowEngine.transition(WORKFLOW_STATES.EMERGENCY_CHECK, { workflowId: definition.id, detected: true }, step.agentId);
        break;
      }
    }

    if (!emergencyDetected) {
      this.workflowEngine.transition(WORKFLOW_STATES.EMERGENCY_CHECK, { workflowId: definition.id, detected: false }, "Orchestrator");
      this.workflowEngine.transition(WORKFLOW_STATES.RESPONSE_GENERATION, { workflowId: definition.id }, "ResponseBuilder");
    }

    const response = this.responseBuilder.buildResponse(results, { workflowId: definition.id });
    this.workflowEngine.transition(WORKFLOW_STATES.COMPLETED, { workflowId: definition.id }, "Orchestrator");

    return this.workflowEngine.buildResult(input, response, emergencyDetected);
  }

  private getStateForStep(step: WorkflowStep): typeof WORKFLOW_STATES[keyof typeof WORKFLOW_STATES] {
    if (step.agentId === "SymptomAgent") {
      return WORKFLOW_STATES.SYMPTOM_ANALYSIS;
    }
    if (step.agentId === "KnowledgeAgent") {
      return WORKFLOW_STATES.KNOWLEDGE_RETRIEVAL;
    }
    if (step.agentId === "SeverityAgent") {
      return WORKFLOW_STATES.SEVERITY_ANALYSIS;
    }
    if (step.agentId === "SafetyAgent") {
      return WORKFLOW_STATES.SAFETY_VALIDATION;
    }
    return WORKFLOW_STATES.RESPONSE_GENERATION;
  }
}
