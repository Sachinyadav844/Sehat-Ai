import { MEMORY_AGENT_PROMPT } from "./prompt";
import { MemoryAgentValidator } from "./validator";
import type { MemoryAgentInput, MemoryAgentOutput } from "./types";

export class MemoryAgent {
  private validator = new MemoryAgentValidator();

  async analyze(input: MemoryAgentInput): Promise<MemoryAgentInput> {
    return input;
  }

  async validate(input: MemoryAgentOutput): Promise<boolean> {
    return this.validator.validate(input);
  }

  async execute(input: MemoryAgentInput): Promise<MemoryAgentOutput> {
    const symptomProfile = input.symptomProfile as Record<string, unknown>;
    const summary = `Stored memory for patient ${input.userId} from request ${input.requestId}. Symptom profile keys: ${Object.keys(symptomProfile).join(", ")}`;
    const output: MemoryAgentOutput = {
      sessionId: input.requestId,
      patientId: input.userId,
      memoryStored: true,
      summary,
    };

    if (!(await this.validate(output))) {
      throw new Error("MemoryAgent produced invalid output");
    }

    return output;
  }
}
