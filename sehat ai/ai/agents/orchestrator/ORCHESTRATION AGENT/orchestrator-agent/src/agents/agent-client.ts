import { Agent, AgentExecutePayload, AgentExecuteResult, AgentHealthStatus, AgentMetadata } from "../interfaces/agent";

export class AgentClient {
  constructor(private readonly agent: Agent) {}

  public async execute(payload: AgentExecutePayload): Promise<AgentExecuteResult> {
    return this.agent.execute(payload);
  }

  public async healthCheck(): Promise<AgentHealthStatus> {
    return this.agent.healthCheck();
  }

  public metadata(): AgentMetadata {
    return this.agent.metadata();
  }
}
