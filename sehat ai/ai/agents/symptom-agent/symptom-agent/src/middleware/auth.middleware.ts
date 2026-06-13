import type { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../config/env.js';

export async function validateApiKey(request: FastifyRequest, reply: FastifyReply) {
  if (!env.apiKey) {
    return;
  }
  const apiKey = request.headers['x-api-key'] as string | undefined;
  if (!apiKey || apiKey !== env.apiKey) {
    reply.status(401).send({
      success: false,
      agent: 'symptom-agent',
      timestamp: new Date().toISOString(),
      error: 'Unauthorized',
      nextStep: 'Provide a valid API key in x-api-key header.',
    });
    return;
  }
}
