import { EMERGENCY_AGENT_PROMPT } from "./prompt";
import { EmergencyAgentValidator } from "./validator";
import type { EmergencyAgentInput, EmergencyAgentOutput } from "./types";

export class EmergencyAgent {
  private validator = new EmergencyAgentValidator();

  async analyze(input: EmergencyAgentInput): Promise<EmergencyAgentInput> {
    return input;
  }

  async validate(input: EmergencyAgentOutput): Promise<boolean> {
    return this.validator.validate(input);
  }

  async execute(input: EmergencyAgentInput): Promise<EmergencyAgentOutput> {
    const symptomProfile = input.symptomProfile as Record<string, unknown>;
    const symptoms = Array.isArray(symptomProfile.symptoms)
      ? (symptomProfile.symptoms as string[])
      : [];
    const severity = typeof (input.severityResult as Record<string, unknown>).severity === "string"
      ? ((input.severityResult as Record<string, unknown>).severity as string).toUpperCase()
      : "LOW";
    const safetyScore = typeof (input.safetyResult as Record<string, unknown>).safetyScore === "number"
      ? ((input.safetyResult as Record<string, unknown>).safetyScore as number)
      : 5;

    const emergencyKeywords = ["chest pain", "severe", "unconscious", "difficulty breathing", "bleeding", "stroke"];
    const hasEmergencySymptom = symptoms.some((symptom) =>
      emergencyKeywords.some((keyword) => symptom.toLowerCase().includes(keyword))
    );
    const emergencyDetected = hasEmergencySymptom || severity === "CRITICAL" || safetyScore <= 2;
    const emergencyType = emergencyDetected
      ? severity === "CRITICAL"
        ? "CRITICAL"
        : "URGENT"
      : "ROUTINE";

    const output: EmergencyAgentOutput = {
      emergencyDetected,
      emergencyType,
      reason: emergencyDetected ? "Symptoms and severity indicate emergency care." : "No immediate emergency detected.",
      recommendedAction: emergencyDetected ? "Call emergency services or go to the nearest ER." : "Schedule an appointment with a specialist and monitor symptoms.",
    };

    if (!(await this.validate(output))) {
      throw new Error("EmergencyAgent produced invalid output");
    }

    return output;
  }
}
