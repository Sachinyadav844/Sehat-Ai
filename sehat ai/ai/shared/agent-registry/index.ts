export interface AgentMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  capabilities: string[];
}

export interface AgentHealthStatus {
  healthy: boolean;
  details: string;
}

export interface AgentExecutePayload {
  sessionId: string;
  conversationId: string;
  language: string;
  input: string;
  context?: Record<string, unknown>;
}

export interface AgentExecuteResult {
  success: boolean;
  output: string;
  data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface Agent {
  metadata(): AgentMetadata;
  execute(payload: AgentExecutePayload): Promise<AgentExecuteResult>;
  healthCheck(): Promise<AgentHealthStatus>;
}

export class AgentRegistry {
  private agents = new Map<string, Agent>();

  register(agent: Agent): void {
    const metadata = agent.metadata();
    this.agents.set(metadata.id, agent);
  }

  unregister(agentId: string): boolean {
    return this.agents.delete(agentId);
  }

  get(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  list(): AgentMetadata[] {
    return Array.from(this.agents.values()).map((agent) => agent.metadata());
  }

  async healthCheck(): Promise<Record<string, AgentHealthStatus>> {
    const statuses: Record<string, AgentHealthStatus> = {};
    for (const [id, agent] of this.agents.entries()) {
      try {
        statuses[id] = await agent.healthCheck();
      } catch (error) {
        statuses[id] = {
          healthy: false,
          details: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }
    return statuses;
  }
}

export const globalAgentRegistry = new AgentRegistry();
