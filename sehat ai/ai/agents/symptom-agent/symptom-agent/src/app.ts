import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { logger } from './utils/logger.js';
import { symptomRoutes } from './routes/symptom.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { env } from './config/env.js';

export function createApp() {
  const app = Fastify({
    logger: {
      level: env.nodeEnv === 'production' ? 'info' : 'debug',
    },
    trustProxy: true,
  });

  const corsPlugin = (cors as any).default ?? cors;
  const helmetPlugin = (helmet as any).default ?? helmet;
  const rateLimitPlugin = (rateLimit as any).default ?? rateLimit;

  app.register(corsPlugin, {
    origin: true,
    methods: ['GET', 'POST', 'DELETE'],
  });

  app.register(helmetPlugin);

  app.register(rateLimitPlugin, {
    max: 200,
    timeWindow: '1 minute',
  });

  app.setErrorHandler(errorHandler);
  app.register(symptomRoutes, { prefix: '/' });

  app.addHook('onRequest', async (request, _reply) => {
    logger.debug({ method: request.method, url: request.url }, 'Incoming request');
  });

  return app;
}
