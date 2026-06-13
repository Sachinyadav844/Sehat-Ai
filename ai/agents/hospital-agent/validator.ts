import type { HospitalRecommendation } from "./types";

export class HospitalAgentValidator {
  async validate(recommendations: HospitalRecommendation[]): Promise<boolean> {
    return Array.isArray(recommendations) && recommendations.length > 0 && recommendations.every((item) => typeof item.hospitalId === "string");
  }
}
