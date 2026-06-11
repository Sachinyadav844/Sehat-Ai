import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";
import { createApp } from "./server";
import { logger } from "./utils/logger";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const app = express();
const server = createServer(app);
createApp(server, app);

server.listen(port, () => {
  logger.info(`SehatAI Orchestrator Agent listening on port ${port}`);
});

server.on("error", (error) => {
  logger.error("Server error", { error });
  process.exit(1);
});

const shutdown = async (signal: string) => {
  logger.info("Shutdown initiated", { signal });
  server.close((err) => {
    if (err) {
      logger.error("Error during server close", { err });
      process.exit(1);
    }
    logger.info("HTTP server closed");
    process.exit(0);
  });
  setTimeout(() => {
    logger.warn("Forcing shutdown after timeout");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
