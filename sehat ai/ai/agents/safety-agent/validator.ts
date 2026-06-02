import type { SafetyAgentOutput } from "./types";

export class SafetyAgentValidator {
  async validate(output: SafetyAgentOutput): Promise<boolean> {
    return (
      typeof output.safeResponse === "boolean" &&
      typeof output.confidence === "number" &&
      typeof output.safetyScore === "number" &&
      Array.isArray(output.issues)
    );
  }
}
