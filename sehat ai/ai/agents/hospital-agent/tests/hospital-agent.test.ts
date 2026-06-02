import { describe, expect, it } from "vitest";
import { HospitalAgent } from "../service";

describe("HospitalAgent", () => {
  it("should return ranked hospital recommendations", async () => {
    const agent = new HospitalAgent();
    const output = await agent.execute({ location: "central", disease: "cardiology", riskLevel: "HIGH" });

    expect(output.length).toBeGreaterThan(0);
    expect(output[0].score).toBeGreaterThanOrEqual(0);
  });
});
