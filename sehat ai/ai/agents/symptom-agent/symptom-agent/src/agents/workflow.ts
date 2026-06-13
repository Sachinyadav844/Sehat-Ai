import { createSymptomExtractionChain } from './chains.js';
import { validateSymptomAnalysisResponse } from '../validators/response.validator.js';
import type { SymptomAnalysis } from '../models/symptom.types.js';

interface AnalyzeSymptomsWorkflowResult {
  valid: boolean;
  payload: SymptomAnalysis;
  raw: string;
}

export async function analyzeSymptomsWorkflow(options: {
  message: string;
  language: string;
  sessionContext: string;
  history: string;
}): Promise<AnalyzeSymptomsWorkflowResult> {
  const chain = createSymptomExtractionChain();
  const response = await chain.call({
    message: options.message,
    sessionContext: options.sessionContext,
    history: options.history,
    language: options.language,
  });

  const rawText = String(response?.text ?? '');
  let parsed: unknown = null;

  try {
    parsed = JSON.parse(rawText.trim());
  } catch (error) {
    const fallback: SymptomAnalysis = {
      success: true,
      agent: 'symptom-agent',
      timestamp: new Date().toISOString(),
      language: options.language,
      data: {
        summary: { primarySymptoms: ['symptoms'], duration: 'unknown', severityHint: 'unknown' },
        followUpQuestions: ['Can you tell me more about your symptoms?'],
        emergencySignals: false,
        conversationStage: 'follow-up',
      },
      nextStep: 'continue conversation',
    };
    return { valid: false, payload: fallback, raw: rawText };
  }

  const validation = validateSymptomAnalysisResponse({
    success: true,
    agent: 'symptom-agent',
    timestamp: new Date().toISOString(),
    language: options.language,
    data: parsed,
    nextStep: 'awaiting patient response',
  });

  if (!validation.success) {
    const fallback: SymptomAnalysis = {
      success: true,
      agent: 'symptom-agent',
      timestamp: new Date().toISOString(),
      language: options.language,
      data: {
        summary: { primarySymptoms: ['symptoms'], duration: 'unknown', severityHint: 'unknown' },
        followUpQuestions: ['Can you tell me more about your symptoms?'],
        emergencySignals: false,
        conversationStage: 'follow-up',
      },
      nextStep: 'continue conversation',
    };
    return { valid: false, payload: fallback, raw: rawText };
  }

  return { valid: true, payload: validation.data, raw: rawText };
}
