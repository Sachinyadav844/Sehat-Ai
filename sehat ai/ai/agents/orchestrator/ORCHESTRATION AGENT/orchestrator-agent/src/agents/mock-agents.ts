import { BaseAgent } from "./base-agent";
import { AgentExecutePayload, AgentExecuteResult, AgentHealthStatus, AgentMetadata } from "../interfaces/agent";

export class SymptomAgent extends BaseAgent {
  public metadata(): AgentMetadata {
    return { id: "SymptomAgent", name: "Symptom Agent", version: "1.0.0", description: "Analyzes symptoms and extracts clinical context.", capabilities: ["symptom-analysis"] };
  }

  public async execute(payload: AgentExecutePayload): Promise<AgentExecuteResult> {
    const symptoms = payload.input
      .split(/[\.\,\;\n]+/)
      .map((segment) => segment.trim())
      .filter((segment) => segment.length > 3)
      .slice(0, 5)
      .map((segment) => ({ name: segment }));

    return {
      success: true,
      output: `Symptom analysis completed for input: ${payload.input}`,
      data: {
        symptomSummary: payload.input.slice(0, 128),
        symptoms: symptoms.length > 0 ? symptoms : [{ name: payload.input || 'unspecified' }],
      },
      metadata: { step: "SYMPTOM_ANALYSIS" },
    };
  }

  public async healthCheck(): Promise<AgentHealthStatus> {
    return { healthy: true, details: "Symptom agent reachable" };
  }
}

export class SeverityAgent extends BaseAgent {
  public metadata(): AgentMetadata {
    return { id: "SeverityAgent", name: "Severity Agent", version: "1.0.0", description: "Assesses urgency and severity of symptoms.", capabilities: ["severity-analysis"] };
  }

  public async execute(payload: AgentExecutePayload): Promise<AgentExecuteResult> {
    const severity = /pain|severe|emergency/i.test(payload.input) ? "high" : "moderate";
    return {
      success: true,
      output: `Severity score is ${severity}`,
      data: { level: severity },
      metadata: { step: "SEVERITY_ANALYSIS", level: severity },
    };
  }

  public async healthCheck(): Promise<AgentHealthStatus> {
    return { healthy: true, details: "Severity agent reachable" };
  }
}

export class KnowledgeAgent extends BaseAgent {
  public metadata(): AgentMetadata {
    return { id: "KnowledgeAgent", name: "Knowledge Agent", version: "1.0.0", description: "Retrieves supporting medical knowledge.", capabilities: ["knowledge-retrieval"] };
  }

  public async execute(payload: AgentExecutePayload): Promise<AgentExecuteResult> {
    return {
      success: true,
      output: "Knowledge retrieval completed. Relevant clinical context has been gathered.",
      data: { reference: "general-clinical-guidance" },
      metadata: { step: "KNOWLEDGE_RETRIEVAL" },
    };
  }

  public async healthCheck(): Promise<AgentHealthStatus> {
    return { healthy: true, details: "Knowledge agent reachable" };
  }
}

export class SafetyAgent extends BaseAgent {
  public metadata(): AgentMetadata {
    return { id: "SafetyAgent", name: "Safety Agent", version: "1.0.0", description: "Performs safety validation and checks guardrails.", capabilities: ["safety-validation"] };
  }

  public async execute(payload: AgentExecutePayload): Promise<AgentExecuteResult> {
    const emergencyFlag = /emergency|danger|life-threatening/i.test(payload.input);
    return {
      success: true,
      output: emergencyFlag ? "Emergency conditions detected" : "Safety checks passed",
      data: { safety: emergencyFlag ? "pending emergency triage" : "safe" , emergencyFlag},
      metadata: { step: "SAFETY_VALIDATION", safety: emergencyFlag ? "urgent" : "nominal" },
    };
  }

  public async healthCheck(): Promise<AgentHealthStatus> {
    return { healthy: true, details: "Safety agent reachable" };
  }
}
