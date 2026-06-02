import { describe, expect, it } from "vitest";
import { SymptomAgent } from "../service";

describe("SymptomAgent", () => {
  it("should generate a structured symptom profile", async () => {
    const agent = new SymptomAgent();
    const profile = await agent.execute({
      text: "I have had a fever and cough for 3 days, I am a 35 year old male with asthma history.",
      language: "en",
      history: []
    });

    expect(profile.symptoms.length).toBeGreaterThan(0);
    expect(profile.age).toBe(35);
    expect(profile.gender).toBe("male");
    expect(profile.confidence).toBeGreaterThanOrEqual(0);
  });
});
