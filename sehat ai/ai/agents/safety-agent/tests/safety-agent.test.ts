import { describe, expect, it } from "vitest";
import { SafetyAgent } from "../service";

describe("SafetyAgent", () => {
  it("should validate safety output structure", async () => {
    const agent = new SafetyAgent();
    const output = await agent.execute({ symptomProfile: { symptoms: ["cough"] }, severityResult: { severity: "LOW" } });

    expect(typeof output.safeResponse).toBe("boolean");
    expect(output.confidence).toBeGreaterThanOrEqual(0);
    expect(output.safetyScore).toBeGreaterThanOrEqual(0);
  });
});
