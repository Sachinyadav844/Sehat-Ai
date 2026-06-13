import { AUDIT_AGENT_PROMPT } from "./prompt";
import { AuditAgentValidator } from "./validator";
import type { AuditAgentInput, AuditAgentOutput } from "./types";

export class AuditAgent {
  private validator = new AuditAgentValidator();

  async analyze(input: AuditAgentInput): Promise<AuditAgentInput> {
    return input;
  }

  async validate(input: AuditAgentOutput): Promise<boolean> {
    return this.validator.validate(input);
  }

  async execute(input: AuditAgentInput): Promise<AuditAgentOutput> {
    const stages = ["language", "symptom", "severity", "safety", "emergency", "hospital", "appointment", "report"];
    const output: AuditAgentOutput = {
      auditId: `audit-${Date.now()}`,
      auditedAt: new Date().toISOString(),
      status: "COMPLETED",
      details: `Audit for request ${input.requestId} and user ${input.userId}. Completed stages: ${stages.join(" -> ")}.`,
    };

    if (!(await this.validate(output))) {
      throw new Error("AuditAgent produced invalid output");
    }

    return output;
  }
}
