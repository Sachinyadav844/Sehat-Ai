import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

const start = async () => {
  try {
    await app.listen({ port: env.port, host: '0.0.0.0' });
    logger.info({ port: env.port }, 'Symptom Agent is running');
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

start();
