import { AgentService } from "../agent-base";
import type { SafetyAgentInput, SafetyAgentOutput } from "./types";
import { SafetyAgentValidator } from "./validator";
import { Logger } from "../../shared/logger";

const unsafeTerms = ["guarantee", "sure cure", "definitive", "no risk", "always work"];
const uncertainTerms = ["may", "might", "could", "possible", "unclear"];

export class SafetyAgent implements AgentService<SafetyAgentInput, SafetyAgentOutput> {
  private validator = new SafetyAgentValidator();

  async analyze(input: SafetyAgentInput): Promise<SafetyAgentOutput> {
    const symptomText = JSON.stringify(input.symptomProfile).toLowerCase();
    const severityText = JSON.stringify(input.severityResult).toLowerCase();

    const issues: string[] = [];
    let confidence = 0.85;

    if (unsafeTerms.some((term) => symptomText.includes(term) || severityText.includes(term))) {
      issues.push("Potential unsafe recommendation detected");
      confidence -= 0.3;
    }
    if (uncertainTerms.some((term) => symptomText.includes(term) || severityText.includes(term))) {
      issues.push("Uncertainty detected in clinical reasoning");
      confidence -= 0.15;
    }
    if (!input.symptomProfile || Object.keys(input.symptomProfile).length === 0) {
      issues.push("Missing symptom profile");
      confidence -= 0.25;
    }

    const safetyScore = Math.max(0, Math.min(1, confidence));
    return {
      safeResponse: issues.length === 0,
      confidence: Number(Math.max(0, Math.min(1, confidence)).toFixed(2)),
      safetyScore: Number(safetyScore.toFixed(2)),
      issues
    };
  }

  async validate(output: SafetyAgentOutput): Promise<boolean> {
    return this.validator.validate(output);
  }

  async execute(input: SafetyAgentInput): Promise<SafetyAgentOutput> {
    const output = await this.analyze(input);
    if (!(await this.validate(output))) {
      Logger.warn("Safety output validation failed", "SafetyAgent");
      return { ...output, safeResponse: false, confidence: 0.4, safetyScore: 0.4 };
    }
    return output;
  }
}
