import { describe, expect, it } from "vitest";
import { AuditAgent } from "../service";

describe("AuditAgent", () => {
  it("should create an audit log entry", async () => {
    const agent = new AuditAgent();
    const result = await agent.execute({
      requestId: "req-1",
      userId: "patient-123",
      symptomProfile: { symptoms: ["fever"] },
      severityResult: { severity: "LOW" },
      safetyResult: { safetyScore: 4 },
      emergencyResult: { emergencyDetected: false, emergencyType: "ROUTINE", reason: "", recommendedAction: "" },
      appointment: { doctor: "Dr. Lee" },
      report: { reportId: "report-1" },
    });

    expect(result.auditId).toBeDefined();
    expect(result.status).toBe("COMPLETED");
    expect(result.details).toContain("Audit for request req-1");
  });
});
