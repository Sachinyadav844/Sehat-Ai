import { v4 as uuidv4 } from 'uuid';
import { sessionMemory } from '../memory/session.memory.js';
import { patientMemory } from '../memory/patient.memory.js';
import { detectEmergencySignals, emergencyEscalationText } from './emergency.service.js';
import { buildConversationContext } from './conversation.service.js';
import { resolveConversationLanguage } from './multilingual.service.js';
import { symptomAgent } from '../agents/symptom.agent.js';
import { symptomAnalysisSchema } from '../models/symptom.types.js';
import type { SymptomAnalysis, SymptomSummary } from '../models/symptom.types.js';

export async function createSession() {
  const sessionId = uuidv4();
  const session = await sessionMemory.createSession(sessionId, 'en');
  return { sessionId: session.sessionId, createdAt: session.createdAt };
}

export async function getSession(sessionId: string) {
  return sessionMemory.getSession(sessionId);
}

export async function clearSession(sessionId: string) {
  await sessionMemory.clearSession(sessionId);
  patientMemory.clearSummary(sessionId);
  return true;
}

export async function analyzeSymptoms(options: {
  sessionId: string;
  message: string;
  language?: string;
}): Promise<SymptomAnalysis> {
  const session = await sessionMemory.getSession(options.sessionId);

  if (!session) {
    throw new Error('Session not found');
  }

  // Resolve language: prefer request language, then session language, then default to English
  const requestLanguage = resolveConversationLanguage(options.language);
  const language = requestLanguage !== 'en' ? requestLanguage : (session.language || requestLanguage);
  
  const sessionContext = buildConversationContext(session);
  const history = session.history.map((item) => `${item.role}: ${item.text}`).join('\n');

  await sessionMemory.appendHistory(options.sessionId, 'patient', options.message);

  const agentResponse = await symptomAgent.analyze({
    sessionId: options.sessionId,
    message: options.message,
    language,
    sessionContext,
    history,
  });

  const safePayload: SymptomAnalysis = agentResponse.valid
    ? agentResponse.payload
    : ({
        success: true,
        agent: 'symptom-agent',
        timestamp: new Date().toISOString(),
        language,
        data: {
          summary: { primarySymptoms: ['symptoms'], duration: 'unknown', severityHint: 'unknown' },
          followUpQuestions: ['Can you tell me more about your symptoms?'],
          emergencySignals: false,
          conversationStage: 'follow-up',
        },
        nextStep: 'continue conversation',
      } as SymptomAnalysis);

  const emergencyDetected = safePayload.data.emergencySignals || detectEmergencySignals(options.message);
  const conversationStage = emergencyDetected ? 'urgent' : safePayload.data.conversationStage;

  const output: SymptomAnalysis = {
    success: true,
    agent: 'symptom-agent',
    timestamp: new Date().toISOString(),
    language,
    data: {
      ...safePayload.data,
      conversationStage,
      emergencySignals: emergencyDetected,
    },
    nextStep: emergencyDetected ? emergencyEscalationText(language) : 'continue conversation',
  };

  await sessionMemory.updateSession(options.sessionId, {
    language,
    conversationStage,
    emergencySignals: emergencyDetected,
    latestSummary: output.data.summary,
  });

  if (output.data.summary.primarySymptoms.length > 0) {
    patientMemory.saveSummary(options.sessionId, output.data.summary);
  }

  await sessionMemory.appendHistory(options.sessionId, 'agent', output.data.followUpQuestions.join(' | '));

  const validation = symptomAnalysisSchema.safeParse(output);
  if (!validation.success) {
    throw new Error('Symptom analysis returned invalid data');
  }

  return validation.data;
}
