import type { AppointmentAgentOutput } from "./types";

export class AppointmentAgentValidator {
  async validate(output: AppointmentAgentOutput): Promise<boolean> {
    return (
      typeof output.appointmentId === "string" &&
      typeof output.patientId === "string" &&
      typeof output.hospitalId === "string" &&
      typeof output.doctor === "string" &&
      typeof output.scheduledAt === "string"
    );
  }
}
