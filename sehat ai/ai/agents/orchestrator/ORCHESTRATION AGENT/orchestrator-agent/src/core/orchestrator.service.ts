import { Server as SocketIOServer } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { WorkflowInput, WorkflowResult } from "../interfaces/workflow";
import { AgentRegistry } from "../agents/agent-registry";
import { AgentRouter } from "../agents/agent-router";
import { ExecutionManager } from "./execution-manager";
import { WorkflowBuilder } from "../workflow/workflow-builder";
import { WorkflowRunner } from "../workflow/workflow-runner";
import { StateManager } from "../state/state-manager";
import { createMemoryService } from "../memory";
import { EmergencyHandler } from "../emergency/emergency-handler";
import { SymptomAgent, SeverityAgent, SafetyAgent, KnowledgeAgent } from "../agents/mock-agents";
import { HealthReport } from "../interfaces/health";
import { WORKFLOW_EVENTS } from "../constants/events.constants";
import { logger } from "../utils/logger";

const workflowStore = new Map<string, WorkflowResult>();

export class OrchestratorService {
  private readonly registry = new AgentRegistry();
  private readonly executionManager = new ExecutionManager();
  private readonly agentRouter = new AgentRouter(this.registry, this.executionManager);
  private readonly workflowBuilder = new WorkflowBuilder();
  private readonly workflowRunner = new WorkflowRunner(this.agentRouter);
  private readonly stateManager = new StateManager();
  private readonly memoryService = createMemoryService();
  private readonly emergencyHandler = new EmergencyHandler();
  private readonly publisher: { publish(event: string, payload: Record<string, unknown>): void };

  constructor(io: SocketIOServer) {
    this.publisher = { publish: (event, payload) => io.emit(event, payload) };
    this.registerDefaultAgents();
  }

  public static factory(io: SocketIOServer): OrchestratorService {
    return new OrchestratorService(io);
  }

  public async process(payload: WorkflowInput): Promise<WorkflowResult> {
    const input = { ...payload, sessionId: payload.sessionId || uuidv4() };
    this.stateManager.initializeSession(input.sessionId, input.language, input.metadata || {});
    this.stateManager.initializeConversation(input.sessionId, input.conversationId, input.language);

    this.publisher.publish(WORKFLOW_EVENTS.LISTENING, { sessionId: input.sessionId, conversationId: input.conversationId, status: WORKFLOW_EVENTS.LISTENING });

    return this.executeWorkflow(input);
  }

  public async startWorkflow(payload: WorkflowInput): Promise<WorkflowResult> {
    return this.process(payload);
  }

  public async continueWorkflow(workflowId: string, additionalInput: string): Promise<WorkflowResult> {
    const stored = workflowStore.get(workflowId);
    if (!stored) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const input: WorkflowInput = {
      sessionId: stored.sessionId,
      conversationId: stored.conversationId,
      language: stored.language,
      input: additionalInput,
      metadata: { continued: true },
    };

    this.publisher.publish(WORKFLOW_EVENTS.ANALYZING, { workflowId, status: WORKFLOW_EVENTS.ANALYZING });
    return this.executeWorkflow(input, workflowId);
  }

  public getWorkflowStatus(workflowId: string): WorkflowResult | undefined {
    return workflowStore.get(workflowId);
  }

  public listAgents() {
    return this.registry.list();
  }

  public async healthCheck(): Promise<HealthReport> {
    const agentStatuses = await this.registry.healthCheck();
    const allHealthy = Object.values(agentStatuses).every((s) => s.healthy === true);
    const memoryHealth = await this.memoryService.healthCheck();

    return {
      orchestrator: "ok",
      registry: allHealthy ? "ok" : "degraded",
      memory: memoryHealth.status === "healthy" ? "ok" : "degraded",
      websocket: "ok",
      pipeline: "ok",
      timestamp: new Date().toISOString(),
    };
  }

  private executeWorkflow(input: WorkflowInput, workflowId?: string): Promise<WorkflowResult> {
    const definition = this.workflowBuilder.build(input);
    const result = this.workflowRunner.run(definition, input).then((output) => {
      const finalWorkflow = { ...output, workflowId: workflowId || definition.id };
      workflowStore.set(finalWorkflow.workflowId, finalWorkflow);
      if (finalWorkflow.emergencyDetected) {
        const emergency = this.emergencyHandler.createEvent(finalWorkflow.sessionId, finalWorkflow.conversationId, finalWorkflow.workflowId, "Emergency detected during safety validation");
        this.publisher.publish(WORKFLOW_EVENTS.EMERGENCY, emergency);
      }
      this.publisher.publish(finalWorkflow.workflowStatus === "COMPLETED" ? WORKFLOW_EVENTS.COMPLETED : WORKFLOW_EVENTS.FAILED, {
        workflowId: finalWorkflow.workflowId,
        status: finalWorkflow.workflowStatus,
      });
      return finalWorkflow;
    });
    return result;
  }

  private registerDefaultAgents(): void {
    this.registry.register(new SymptomAgent());
    this.registry.register(new KnowledgeAgent());
    this.registry.register(new SeverityAgent());
    this.registry.register(new SafetyAgent());
  }
}

export function orchestratorServiceFactory(io: SocketIOServer) {
  return OrchestratorService.factory(io);
}
