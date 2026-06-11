import { AgentExecuteResult } from "../interfaces/agent";
import { UnifiedResponse } from "../interfaces/response";

export class ResponseBuilder {
  public buildResponse(results: AgentExecuteResult[], metadata: Record<string, unknown> = {}): UnifiedResponse {
    const combinedOutput = results.map((result) => result.output).join(" \n\n");
    const symptomResult = results.find((result) => result.metadata?.step === "SYMPTOM_ANALYSIS");
    const severityResult = results.find((result) => result.metadata?.step === "SEVERITY_ANALYSIS");
    const safetyResult = results.find((result) => result.metadata?.step === "SAFETY_VALIDATION");
    const knowledgeResult = results.find((result) => result.metadata?.step === "KNOWLEDGE_RETRIEVAL");

    const symptoms = Array.isArray(symptomResult?.data?.symptoms)
      ? symptomResult.data.symptoms
      : [];

    const risk = typeof severityResult?.data?.level === "string" ? severityResult.data.level : "unknown";
    const riskScore = typeof severityResult?.data?.score === "number" ? severityResult.data.score : 0;
    const confidence = severityResult?.data?.confidence ? String(severityResult.data.confidence) : results.every((result) => result.success) ? "high" : "medium";

    const recommendations = [
      ...(knowledgeResult?.output ? [knowledgeResult.output] : []),
      ...(safetyResult?.output ? [safetyResult.output] : []),
    ].filter(Boolean) as string[];

    const emergencyDetected = Boolean(safetyResult?.data?.emergencyFlag || false);
    const nextAction = emergencyDetected ? "emergency-escalation" : "appointment-booking";

    return {
      summary: combinedOutput,
      symptoms,
      risk,
      riskScore,
      confidence,
      recommendation: safetyResult?.output
        ? `Safety advice: ${safetyResult.output}`
        : "Monitor symptoms and seek clinical support if needed.",
      recommendations,
      nextAction,
      emergencyMessage: emergencyDetected ? safetyResult?.output : undefined,
      safetyIssues: Array.isArray(safetyResult?.data?.issues) ? safetyResult.data.issues : [],
      metadata: {
        agentCount: results.length,
        safetyStatus: safetyResult?.data?.safety || "pending",
        ...metadata,
      },
    };
  }
}
