import { REPORT_AGENT_PROMPT } from "./prompt";
import { ReportAgentValidator } from "./validator";
import type { ReportAgentInput, ReportAgentOutput } from "./types";

export class ReportAgent {
  private validator = new ReportAgentValidator();

  async analyze(input: ReportAgentInput): Promise<ReportAgentInput> {
    return input;
  }

  async validate(input: ReportAgentOutput): Promise<boolean> {
    return this.validator.validate(input);
  }

  async execute(input: ReportAgentInput): Promise<ReportAgentOutput> {
    const symptomProfile = input.symptomProfile as Record<string, unknown>;
    const severityResult = input.severityResult as Record<string, unknown>;
    const safetyResult = input.safetyResult as Record<string, unknown>;
    const emergencyResult = input.emergencyResult as Record<string, unknown>;
    const appointment = input.appointment as Record<string, unknown>;

    const symptoms = Array.isArray(symptomProfile.symptoms)
      ? (symptomProfile.symptoms as string[])
      : [];
    const severity = typeof severityResult.severity === "string"
      ? severityResult.severity as string
      : "UNKNOWN";
    const safetySummary = typeof safetyResult.safetyScore === "number"
      ? `Safety score ${safetyResult.safetyScore}`
      : "Safety review completed";
    const emergencySummary = typeof emergencyResult.emergencyType === "string"
      ? emergencyResult.emergencyType as string
      : "ROUTINE";
    const hospitalName = Array.isArray(input.hospitalRecommendations) && input.hospitalRecommendations[0]
      ? String((input.hospitalRecommendations[0] as Record<string, unknown>).name ?? "recommended hospital")
      : "recommended hospital";
    const doctorName = typeof appointment.doctor === "string"
      ? appointment.doctor
      : "a specialist";

    const output: ReportAgentOutput = {
      reportId: `report-${Date.now()}`,
      patientId: input.patientId,
      summary: `Patient has symptoms ${symptoms.join(", ")} with severity ${severity}. ${safetySummary}. Emergency level: ${emergencySummary}. Recommended hospital: ${hospitalName}. Appointment scheduled with ${doctorName}.`,
      findings: [
        `Symptoms: ${symptoms.join(", ")}`,
        `Severity assessment: ${severity}`,
        `Safety review: ${safetySummary}`,
        `Emergency level: ${emergencySummary}`,
        `Hospital recommendation: ${hospitalName}`,
      ],
      recommendations: [
        `Follow up with ${hospitalName}`,
        "Monitor symptoms and seek immediate care if condition worsens.",
      ],
      createdAt: new Date().toISOString(),
    };

    if (!(await this.validate(output))) {
      throw new Error("ReportAgent produced invalid output");
    }

    return output;
  }
}
