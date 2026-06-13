import { z } from 'zod';
import { symptomAnalysisSchema } from '../models/symptom.types.js';

export const validatedSymptomAnalysis = symptomAnalysisSchema;

export function validateSymptomAnalysisResponse(payload: unknown) {
  // Normalize the payload to ensure arrays are properly formatted
  const normalized = normalizeSymptomAnalysisPayload(payload);
  return validatedSymptomAnalysis.safeParse(normalized);
}

function normalizeSymptomAnalysisPayload(payload: any): any {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  return {
    ...payload,
    data: payload.data
      ? {
          ...payload.data,
          summary: payload.data.summary
            ? {
                primarySymptoms: Array.isArray(payload.data.summary.primarySymptoms)
                  ? payload.data.summary.primarySymptoms
                  : [String(payload.data.summary.primarySymptoms || 'symptoms')],
                duration: payload.data.summary.duration || 'unknown',
                severityHint: payload.data.summary.severityHint || 'unknown',
              }
            : {
                primarySymptoms: ['symptoms'],
                duration: 'unknown',
                severityHint: 'unknown',
              },
          followUpQuestions: Array.isArray(payload.data.followUpQuestions)
            ? payload.data.followUpQuestions
            : ['Can you tell me more about your symptoms?'],
          emergencySignals: Boolean(payload.data.emergencySignals),
          conversationStage: payload.data.conversationStage || 'follow-up',
        }
      : {
          summary: { primarySymptoms: ['symptoms'], duration: 'unknown', severityHint: 'unknown' },
          followUpQuestions: ['Can you tell me more about your symptoms?'],
          emergencySignals: false,
          conversationStage: 'follow-up',
        },
  };
}
