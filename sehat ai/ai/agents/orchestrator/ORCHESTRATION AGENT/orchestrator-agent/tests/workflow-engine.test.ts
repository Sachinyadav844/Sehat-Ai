import { WorkflowEngine } from "../src/core/workflow-engine";
import { WORKFLOW_STATES } from "../src/constants/workflow.constants";

describe("WorkflowEngine", () => {
  it("should transition through workflow states", () => {
    const engine = new WorkflowEngine();
    engine.transition(WORKFLOW_STATES.LISTENING, { workflowId: "test" }, "Orchestrator");
    engine.transition(WORKFLOW_STATES.SYMPTOM_ANALYSIS, { workflowId: "test" }, "SymptomAgent");
    engine.transition(WORKFLOW_STATES.KNOWLEDGE_RETRIEVAL, { workflowId: "test" }, "KnowledgeAgent");
    engine.transition(WORKFLOW_STATES.SEVERITY_ANALYSIS, { workflowId: "test" }, "SeverityAgent");
    engine.transition(WORKFLOW_STATES.SAFETY_VALIDATION, { workflowId: "test" }, "SafetyAgent");
    engine.transition(WORKFLOW_STATES.EMERGENCY_CHECK, { workflowId: "test" }, "Orchestrator");
    engine.transition(WORKFLOW_STATES.RESPONSE_GENERATION, { workflowId: "test" }, "ResponseBuilder");
    engine.transition(WORKFLOW_STATES.COMPLETED, { workflowId: "test" }, "Orchestrator");

    expect(engine.getCurrentState()).toBe(WORKFLOW_STATES.COMPLETED);
  });

  it("should reject invalid transition", () => {
    const engine = new WorkflowEngine();
    expect(() => engine.transition(WORKFLOW_STATES.COMPLETED, { workflowId: "test" }, "Orchestrator")).toThrow();
  });
});
