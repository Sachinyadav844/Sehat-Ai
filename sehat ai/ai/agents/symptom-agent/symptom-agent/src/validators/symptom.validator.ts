import type { FastifyRequest, FastifyReply } from 'fastify';
import { symptomAnalyzeRequestSchema } from '../models/symptom.types.js';

export function validateAnalyzeRequest(request: FastifyRequest, reply: FastifyReply) {
  const parseResult = symptomAnalyzeRequestSchema.safeParse(request.body);
  if (!parseResult.success) {
    reply.status(400).send({
      success: false,
      agent: 'symptom-agent',
      timestamp: new Date().toISOString(),
      error: 'Invalid request payload',
      details: parseResult.error.errors,
      nextStep: 'Please provide a valid session, message, and language if available.',
    });
    return false;
  }

  request.body = parseResult.data;
  return true;
}
