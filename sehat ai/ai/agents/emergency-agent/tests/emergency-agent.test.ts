import { describe, expect, it } from "vitest";
import { EmergencyAgent } from "../service";

describe("EmergencyAgent", () => {
  it("should detect emergency conditions from symptom profile", async () => {
    const agent = new EmergencyAgent();
    const result = await agent.execute({
      symptomProfile: { symptoms: ["chest pain", "dizziness"] },
      severityResult: { severity: "HIGH" },
      safetyResult: { safetyScore: 1 },
    });

    expect(result.emergencyDetected).toBe(true);
    expect(result.emergencyType).toBe("URGENT");
    expect(result.recommendedAction).toContain("emergency");
  });
});
