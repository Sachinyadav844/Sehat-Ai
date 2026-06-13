import { APPOINTMENT_AGENT_PROMPT } from "./prompt";
import { AppointmentAgentValidator } from "./validator";
import type { AppointmentAgentInput, AppointmentAgentOutput } from "./types";

export class AppointmentAgent {
  private validator = new AppointmentAgentValidator();

  async analyze(input: AppointmentAgentInput): Promise<AppointmentAgentInput> {
    return input;
  }

  async validate(input: AppointmentAgentOutput): Promise<boolean> {
    return this.validator.validate(input);
  }

  async execute(input: AppointmentAgentInput): Promise<AppointmentAgentOutput> {
    const hospital = input.hospitalRecommendations[0] || { id: "unknown", name: "General Hospital" };
    const hospitalRecord = hospital as Record<string, unknown>;
    const specialty = String(hospitalRecord.specialty ?? "General Medicine");
    const hospitalId = String(hospitalRecord.id ?? "unknown");
    const hospitalName = String(hospitalRecord.name ?? "General Hospital");

    const output: AppointmentAgentOutput = {
      appointmentId: `appt-${Date.now()}`,
      patientId: input.patientId,
      hospitalId,
      doctor: `${specialty} Specialist`,
      specialty,
      scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      status: "CONFIRMED",
      notes: `Appointment booked at ${hospitalName} for ${specialty}.`,
    };

    if (!(await this.validate(output))) {
      throw new Error("AppointmentAgent produced invalid output");
    }

    return output;
  }
}
