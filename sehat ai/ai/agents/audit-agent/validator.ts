import type { AuditAgentOutput } from "./types";

export class AuditAgentValidator {
  async validate(output: AuditAgentOutput): Promise<boolean> {
    return (
      typeof output.auditId === "string" &&
      typeof output.auditedAt === "string" &&
      typeof output.status === "string" &&
      typeof output.details === "string"
    );
  }
}
