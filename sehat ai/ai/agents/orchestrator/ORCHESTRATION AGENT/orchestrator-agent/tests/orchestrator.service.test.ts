import { Server } from "socket.io";
import { orchestratorServiceFactory } from "../src/core/orchestrator.service";

describe("OrchestratorService", () => {
  it("should process a workflow and return a completed result", async () => {
    const io = new Server();
    const orchestrator = orchestratorServiceFactory(io);

    const result = await orchestrator.process({
      sessionId: "00000000-0000-0000-0000-000000000000",
      conversationId: "conv-test",
      language: "en",
      input: "Patient reports acute chest pain and shortness of breath",
    });

    expect(result.workflowStatus).toBe("COMPLETED");
    expect(result.response).toBeDefined();
    expect(result.sessionId).toBe("00000000-0000-0000-0000-000000000000");
  });
});
