import { describe, expect, it } from "vitest";
import { ReportAgent } from "../service";

describe("ReportAgent", () => {
  it("should generate a structured report", async () => {
    const agent = new ReportAgent();
    const result = await agent.execute({
      patientId: "patient-123",
      symptomProfile: { symptoms: ["headache", "nausea"] },
      severityResult: { severity: "LOW" },
      safetyResult: { safetyScore: 5 },
      emergencyResult: { emergencyDetected: false, emergencyType: "ROUTINE", reason: "No emergency", recommendedAction: "Monitor" },
      hospitalRecommendations: [{ name: "City Hospital" }],
      appointment: { doctor: "Dr. Smith" },
    });

    expect(result.reportId).toBeDefined();
    expect(result.summary).toContain("Patient has symptoms");
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});
