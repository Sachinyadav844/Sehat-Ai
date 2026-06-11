import { WorkflowDefinition, WorkflowInput } from "../interfaces/workflow";
import { WORKFLOW_STATES } from "../constants/workflow.constants";

export class PipelineManager {
  public buildPipeline(input: WorkflowInput): WorkflowDefinition {
    return {
      id: `${input.sessionId}-${input.conversationId}-${Date.now()}`,
      steps: [
        {
          name: "Symptom analysis",
          agentId: "SymptomAgent",
          description: "Analyze the symptom description and extract clinical signal.",
        },
        {
          name: "Knowledge retrieval",
          agentId: "KnowledgeAgent",
          description: "Retrieve general context and supporting medical knowledge.",
        },
        {
          name: "Severity analysis",
          agentId: "SeverityAgent",
          description: "Estimate severity and risk factors based on symptoms.",
        },
        {
          name: "Safety validation",
          agentId: "SafetyAgent",
          description: "Validate the workflow findings against safety guardrails.",
        },
      ],
    };
  }

  public resolveStateForStep(stepName: string): string {
    switch (stepName) {
      case "Symptom analysis":
        return WORKFLOW_STATES.SYMPTOM_ANALYSIS;
      case "Severity analysis":
        return WORKFLOW_STATES.SEVERITY_ANALYSIS;
      case "Safety validation":
        return WORKFLOW_STATES.SAFETY_VALIDATION;
      default:
        return WORKFLOW_STATES.RESPONSE_GENERATION;
    }
  }
}
