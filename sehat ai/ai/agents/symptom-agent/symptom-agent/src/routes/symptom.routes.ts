import type { FastifyInstance } from 'fastify';
import { healthHandler, startSessionHandler, analyzeSymptomsHandler, getSessionHandler, clearSessionHandler } from '../controllers/symptom.controller.js';
import { validateApiKey } from '../middleware/auth.middleware.js';

export async function symptomRoutes(app: FastifyInstance) {
  app.get('/health', healthHandler);

  app.post('/session/start', { preHandler: validateApiKey }, startSessionHandler);
  app.get('/session/:id', { preHandler: validateApiKey }, getSessionHandler);
  app.delete('/session/:id', { preHandler: validateApiKey }, clearSessionHandler);

  app.post('/symptoms/analyze', { preHandler: validateApiKey }, analyzeSymptomsHandler);
}
