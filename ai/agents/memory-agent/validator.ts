import type { MemoryAgentOutput } from "./types";

export class MemoryAgentValidator {
  async validate(output: MemoryAgentOutput): Promise<boolean> {
    return (
      typeof output.sessionId === "string" &&
      typeof output.patientId === "string" &&
      typeof output.memoryStored === "boolean" &&
      typeof output.summary === "string"
    );
  }
}
