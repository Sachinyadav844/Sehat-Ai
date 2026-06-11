import type { FastifyReply, FastifyRequest } from 'fastify';
import { createSession, analyzeSymptoms, getSession, clearSession } from '../services/symptom.service.js';
import { validateAnalyzeRequest } from '../validators/symptom.validator.js';
import { logger } from '../utils/logger.js';

export async function healthHandler(_request: FastifyRequest, reply: FastifyReply) {
  reply.send({ status: 'ok', service: 'symptom-agent' });
}

export async function startSessionHandler(_request: FastifyRequest, reply: FastifyReply) {
  const session = await createSession();
  reply.send({ success: true, agent: 'symptom-agent', timestamp: new Date().toISOString(), data: session, nextStep: 'send patient message to /symptoms/analyze' });
}

export async function analyzeSymptomsHandler(request: FastifyRequest, reply: FastifyReply) {
  if (!validateAnalyzeRequest(request, reply)) {
    return;
  }

  try {
    const body = request.body as { sessionId: string; message: string; language?: string };
    const result = await analyzeSymptoms({
      sessionId: body.sessionId,
      message: body.message,
      language: body.language,
    });

    reply.send(result);
  } catch (error) {
    logger.error({ err: error }, 'Analyze symptoms failed');
    reply.status(500).send({
      success: false,
      agent: 'symptom-agent',
      timestamp: new Date().toISOString(),
      error: 'Unable to process symptom analysis at this time.',
      nextStep: 'Please retry or contact support if the problem persists.',
    });
  }
}

export async function getSessionHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const session = await getSession(id);
  if (!session) {
    reply.status(404).send({
      success: false,
      agent: 'symptom-agent',
      timestamp: new Date().toISOString(),
      error: 'Session not found',
      nextStep: 'Create a new session with /session/start',
    });
    return;
  }
  reply.send({ success: true, agent: 'symptom-agent', timestamp: new Date().toISOString(), data: session, nextStep: 'continue conversation' });
}

export async function clearSessionHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await clearSession(id);
  reply.send({ success: true, agent: 'symptom-agent', timestamp: new Date().toISOString(), data: { sessionId: id }, nextStep: 'start a new session if needed' });
}
