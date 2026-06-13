import type { FastifyError, FastifyReply } from 'fastify';
import { logger } from '../utils/logger.js';

export function errorHandler(error: FastifyError, request: any, reply: FastifyReply) {
  logger.error({ err: error, path: request.url }, 'Unhandled exception');

  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    success: false,
    agent: 'symptom-agent',
    timestamp: new Date().toISOString(),
    error: 'Internal server error',
    details: error.message,
    nextStep: 'Try again later or contact support.',
  });
}
