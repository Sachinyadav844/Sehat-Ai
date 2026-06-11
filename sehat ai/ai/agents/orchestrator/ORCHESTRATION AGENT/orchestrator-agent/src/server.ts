import express, { Express, Request, Response, NextFunction } from "express";
import http from "http";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { Server as SocketIOServer } from "socket.io";
import { logger } from "./utils/logger";
import { orchestratorServiceFactory } from "./core/orchestrator.service";
import { validateInput, sanitizeRequest } from "./utils/security";
import { processRequestSchema, workflowStartSchema, workflowContinueSchema } from "./utils/validation";
import { AppRequest } from "./interfaces/api";
import { WorkflowInput } from "./interfaces/workflow";
import { createSocketPublisher } from "./dashboard/websocket-publisher";

export function createApp(server: http.Server, app: Express): Express {
  const io = new SocketIOServer(server, {
    path: process.env.WEB_SOCKET_PATH || "/workflow-socket",
    cors: { origin: "*" },
  });

  const orchestrator = orchestratorServiceFactory(io);
  const publisher = createSocketPublisher(io);

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
    max: Number(process.env.RATE_LIMIT_MAX || 120),
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(limiter);
  app.use(sanitizeRequest);

  app.get("/health", async (_req: Request, res: Response) => {
    const health = await orchestrator.healthCheck();
    res.status(200).json(health);
  });

  app.get("/agents", (_req: Request, res: Response) => {
    res.status(200).json(orchestrator.listAgents());
  });

  app.post(
    "/process",
    validateInput(processRequestSchema),
    async (req: AppRequest, res: Response, next: NextFunction) => {
      try {
        const body = req.body as WorkflowInput;
        const result = await orchestrator.process(body);
        publisher.publish("completed", { sessionId: result.sessionId, workflowId: result.workflowId, status: result.workflowStatus });
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  app.post(
    "/workflow/start",
    validateInput(workflowStartSchema),
    async (req: AppRequest, res: Response, next: NextFunction) => {
      try {
        const body = req.body as WorkflowInput;
        const result = await orchestrator.startWorkflow(body);
        publisher.publish("listening", { workflowId: result.workflowId, status: result.workflowStatus });
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  app.post(
    "/workflow/continue",
    validateInput(workflowContinueSchema),
    async (req: AppRequest, res: Response, next: NextFunction) => {
      try {
        const b = req.body as { workflowId: string; input: string };
        const result = await orchestrator.continueWorkflow(b.workflowId, b.input);
        publisher.publish("responding", { workflowId: result.workflowId, status: result.workflowStatus });
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  app.get("/workflow/:id", async (req: Request, res: Response) => {
    const workflow = orchestrator.getWorkflowStatus(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }
    return res.status(200).json(workflow);
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error("Unhandled request error", { message: err.message, stack: err.stack });
    res.status(500).json({ message: "Internal server error", detail: err.message });
  });

  return app;
}
