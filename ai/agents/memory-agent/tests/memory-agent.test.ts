import { describe, expect, it } from "vitest";
import { MemoryAgent } from "../service";

describe("MemoryAgent", () => {
  it("should store memory summary for the workflow", async () => {
    const agent = new MemoryAgent();
    const result = await agent.execute({
      requestId: "req-1",
      userId: "patient-123",
      input: "Patient reported fever and cough.",
      symptomProfile: { symptoms: ["fever", "cough"] },
      severityResult: { severity: "MEDIUM" },
      safetyResult: { safetyScore: 4 },
      emergencyResult: { emergencyDetected: false, emergencyType: "ROUTINE", reason: "", recommendedAction: "" },
      hospitalRecommendations: [{ name: "Central Clinic" }],
      appointment: { doctor: "Dr. Patel" },
      report: { reportId: "report-1" },
    });

    expect(result.memoryStored).toBe(true);
    expect(result.summary).toContain("Stored memory");
  });
});
