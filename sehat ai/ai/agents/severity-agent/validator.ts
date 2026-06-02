import type { SeverityAgentOutput } from "./types";

export class SeverityAgentValidator {
  async validate(output: SeverityAgentOutput): Promise<boolean> {
    return (
      ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(output.severity) &&
      output.riskScore >= 0 &&
      output.riskScore <= 1 &&
      output.confidence >= 0 &&
      output.confidence <= 1
    );
  }
}
