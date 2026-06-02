import { AgentService } from "../agent-base";
import type { SeverityAgentInput, SeverityAgentOutput } from "./types";
import { SeverityAgentValidator } from "./validator";
import { Logger } from "../../shared/logger";

const severityKeywords = {
  critical: ["heart attack", "stroke", "loss of consciousness", "severe pain", "unconscious"],
  high: ["shortness of breath", "chest pain", "high fever", "severe", "intense"],
  medium: ["moderate", "persistent", "worsening"],
  low: ["mild", "occasional", "slight", "light"]
};

export class SeverityAgent implements AgentService<SeverityAgentInput, SeverityAgentOutput> {
  private validator = new SeverityAgentValidator();

  private computeSeverity(text: string): SeverityAgentOutput {
    const lower = text.toLowerCase();
    const found = {
      critical: severityKeywords.critical.some((term) => lower.includes(term)),
      high: severityKeywords.high.some((term) => lower.includes(term)),
      medium: severityKeywords.medium.some((term) => lower.includes(term)),
      low: severityKeywords.low.some((term) => lower.includes(term))
    };

    let severity: SeverityAgentOutput["severity"] = "LOW";
    if (found.critical) severity = "CRITICAL";
    else if (found.high) severity = "HIGH";
    else if (found.medium) severity = "MEDIUM";
    else if (found.low) severity = "LOW";

    const baseScore = severity === "CRITICAL" ? 0.92 : severity === "HIGH" ? 0.78 : severity === "MEDIUM" ? 0.52 : 0.28;
    const durationBoost = text.match(/\b(\d+\s*(days?|weeks?|months?))\b/i) ? 0.08 : 0;
    const score = Math.min(1, baseScore + durationBoost);

    return {
      severity,
      riskScore: Number(score.toFixed(2)),
      emergencyClassification: severity === "HIGH" || severity === "CRITICAL",
      confidence: Number((score * 0.85 + 0.1).toFixed(2))
    };
  }

  async analyze(input: SeverityAgentInput): Promise<SeverityAgentOutput> {
    const text = `${JSON.stringify(input.symptoms)} ${input.duration ?? ""}`;
    Logger.debug(`Analyzing severity from profile`, "SeverityAgent");
    return this.computeSeverity(text);
  }

  async validate(output: SeverityAgentOutput): Promise<boolean> {
    return this.validator.validate(output);
  }

  async execute(input: SeverityAgentInput): Promise<SeverityAgentOutput> {
    const output = await this.analyze(input);
    if (!(await this.validate(output))) {
      Logger.warn("Severity output failed validation", "SeverityAgent");
      return { ...output, confidence: 0.45 };
    }
    return output;
  }
}
