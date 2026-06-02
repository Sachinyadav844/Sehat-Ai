import type { SymptomProfile } from "./types";

export class SymptomAgentValidator {
  async validate(profile: SymptomProfile): Promise<boolean> {
    return (
      Array.isArray(profile.symptoms) &&
      profile.symptoms.length > 0 &&
      profile.confidence >= 0 &&
      profile.confidence <= 1
    );
  }
}
