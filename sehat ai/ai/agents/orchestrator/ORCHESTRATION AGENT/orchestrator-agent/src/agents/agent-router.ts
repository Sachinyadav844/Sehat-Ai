import { AgentExecutePayload, AgentExecuteResult } from "../interfaces/agent";
import { AgentRegistry } from "./agent-registry";
import { ExecutionManager } from "../core/execution-manager";

export class AgentRouter {
  constructor(private readonly registry: AgentRegistry, private readonly executionManager: ExecutionManager) {}

  public async route(agentId: string, payload: AgentExecutePayload): Promise<AgentExecuteResult> {
    const agent = this.registry.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    return this.executionManager.executeAgent(agent, payload);
  }
}
