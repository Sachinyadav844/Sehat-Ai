import { Agent, AgentExecutePayload, AgentExecuteResult, AgentHealthStatus, AgentMetadata } from "../interfaces/agent";

export abstract class BaseAgent implements Agent {
  public abstract execute(payload: AgentExecutePayload): Promise<AgentExecuteResult>;
  public abstract healthCheck(): Promise<AgentHealthStatus>;
  public abstract metadata(): AgentMetadata;
}
