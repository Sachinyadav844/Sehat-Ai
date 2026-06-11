import { AgentRegistry } from "../src/agents/agent-registry";
import { AgentRouter } from "../src/agents/agent-router";
import { ExecutionManager } from "../src/core/execution-manager";
import { SymptomAgent } from "../src/agents/mock-agents";

describe("AgentRouter", () => {
  it("should route to the registered agent", async () => {
    const registry = new AgentRegistry();
    registry.register(new SymptomAgent());
    const router = new AgentRouter(registry, new ExecutionManager());
    const result = await router.route("SymptomAgent", {
      sessionId: "session-1",
      conversationId: "conv-1",
      language: "en",
      input: "I have a headache",
    });

    expect(result.success).toBe(true);
    expect(result.output).toContain("Symptom analysis completed");
  });
});
