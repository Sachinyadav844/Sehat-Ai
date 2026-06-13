import type { ReportAgentOutput } from "./types";

export class ReportAgentValidator {
  async validate(output: ReportAgentOutput): Promise<boolean> {
    return (
      typeof output.reportId === "string" &&
      typeof output.patientId === "string" &&
      typeof output.summary === "string" &&
      Array.isArray(output.findings) &&
      Array.isArray(output.recommendations)
    );
  }
}
