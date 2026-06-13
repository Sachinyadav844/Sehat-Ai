import { describe, expect, it } from "vitest";
import { SeverityAgent } from "../service";

describe("SeverityAgent", () => {
  it("should classify severity from symptom profile", async () => {
    const agent = new SeverityAgent();
    const result = await agent.execute({ symptoms: { symptoms: ["chest pain", "shortness of breath"] }, duration: "2 days" });

    expect(["HIGH", "CRITICAL", "MEDIUM", "LOW"]).toContain(result.severity);
    expect(result.riskScore).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
  });
});
