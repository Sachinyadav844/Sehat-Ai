import { AgentService } from "../agent-base";
import type { HospitalAgentInput, HospitalRecommendation } from "./types";
import { HospitalAgentValidator } from "./validator";
import { Logger } from "../../shared/logger";

const knownHospitals = [
  { hospitalId: "hosp-1", name: "Sehat General Hospital", location: "central", specialists: ["cardiology", "neurology", "emergency"], emergencyAvailable: true },
  { hospitalId: "hosp-2", name: "City Care Medical Center", location: "north", specialists: ["orthopedics", "internal medicine"], emergencyAvailable: true },
  { hospitalId: "hosp-3", name: "Green Valley Clinic", location: "east", specialists: ["pediatrics", "family medicine"], emergencyAvailable: false }
];

export class HospitalAgent implements AgentService<HospitalAgentInput, HospitalRecommendation[]> {
  private validator = new HospitalAgentValidator();

  private rankHospital(input: HospitalAgentInput, hospital: typeof knownHospitals[number]): HospitalRecommendation {
    const baseDistance = hospital.location === input.location.toLowerCase() ? 2 : hospital.location === "central" ? 5 : 12;
    const specialistMatch = hospital.specialists.some((specialist) => input.disease.toLowerCase().includes(specialist)) ? 1.0 : 0.5;
    const riskBoost = input.riskLevel === "CRITICAL" ? 0.25 : input.riskLevel === "HIGH" ? 0.15 : 0.05;

    const score = Number(Math.min(1, specialistMatch * 0.6 + (hospital.emergencyAvailable ? 0.25 : 0.1) + riskBoost).toFixed(2));

    return {
      hospitalId: hospital.hospitalId,
      name: hospital.name,
      distanceKm: baseDistance,
      specialist: hospital.specialists[0],
      emergencyAvailable: hospital.emergencyAvailable,
      score
    };
  }

  async analyze(input: HospitalAgentInput): Promise<HospitalRecommendation[]> {
    Logger.debug("Selecting hospital recommendations", "HospitalAgent");
    return knownHospitals.map((hospital) => this.rankHospital(input, hospital)).sort((a, b) => b.score - a.score);
  }

  async validate(output: HospitalRecommendation[]): Promise<boolean> {
    return this.validator.validate(output);
  }

  async execute(input: HospitalAgentInput): Promise<HospitalRecommendation[]> {
    const output = await this.analyze(input);
    if (!(await this.validate(output))) {
      Logger.warn("Hospital recommendations failed validation", "HospitalAgent");
      return output.slice(0, 1);
    }
    return output;
  }
}
