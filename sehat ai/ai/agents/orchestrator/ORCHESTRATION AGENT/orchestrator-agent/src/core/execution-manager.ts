import { Agent, AgentExecutePayload, AgentExecuteResult } from "../interfaces/agent";
import { DEFAULT_TIMEOUT_MS, WORKFLOW_AGENT_RETRY } from "../constants/app.constants";

export class ExecutionManager {
  public async executeAgent(agent: Agent, payload: AgentExecutePayload): Promise<AgentExecuteResult> {
    return this.retry(async () => this.withTimeout(agent.execute(payload), DEFAULT_TIMEOUT_MS), WORKFLOW_AGENT_RETRY);
  }

  private async retry<T>(fn: () => Promise<T>, retries: number): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) {
        throw error;
      }
      return this.retry(fn, retries - 1);
    }
  }

  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Agent execution timed out")), timeoutMs);
      promise
        .then((result) => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }
}
