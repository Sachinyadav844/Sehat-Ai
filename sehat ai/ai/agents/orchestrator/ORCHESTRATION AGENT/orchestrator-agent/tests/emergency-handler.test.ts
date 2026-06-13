import { EmergencyHandler } from "../src/emergency/emergency-handler";

describe("EmergencyHandler", () => {
  it("should detect emergency from output text", () => {
    const handler = new EmergencyHandler();
    const result = handler.isEmergency({ success: true, output: "This is an emergency situation", data: {} });
    expect(result).toBe(true);
  });

  it("should not detect emergency for normal output", () => {
    const handler = new EmergencyHandler();
    const result = handler.isEmergency({ success: true, output: "Routine check completed", data: {} });
    expect(result).toBe(false);
  });
});
