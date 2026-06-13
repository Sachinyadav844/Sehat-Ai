import type { EmergencyAgentOutput } from "./types";

export class EmergencyAgentValidator {
  async validate(output: EmergencyAgentOutput): Promise<boolean> {
    return (
      typeof output.emergencyDetected === "boolean" &&
      typeof output.emergencyType === "string" &&
      typeof output.reason === "string" &&
      typeof output.recommendedAction === "string"
    );
  }
}
