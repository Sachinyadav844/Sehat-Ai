import { z } from 'zod';

export const symptomAnalyzeRequestSchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().min(5),
  language: z.string().optional(),
});

export const sessionStartResponseSchema = z.object({
  sessionId: z.string().uuid(),
  createdAt: z.string(),
});

export const symptomSummarySchema = z.object({
  primarySymptoms: z.array(z.string()).min(1),
  duration: z.string().optional(),
  severityHint: z.string().optional(),
});

export const symptomAnalysisSchema = z.object({
  success: z.boolean(),
  agent: z.literal('symptom-agent'),
  timestamp: z.string(),
  language: z.string(),
  data: z.object({
    summary: symptomSummarySchema,
    followUpQuestions: z.array(z.string()),
    emergencySignals: z.boolean(),
    conversationStage: z.string(),
  }),
  nextStep: z.string().optional(),
});

export const sessionMemorySchema = z.object({
  sessionId: z.string().uuid(),
  language: z.string(),
  conversationStage: z.string(),
  emergencySignals: z.boolean(),
  createdAt: z.string(),
  lastUpdated: z.string(),
  history: z.array(z.object({ role: z.enum(['patient', 'agent']), text: z.string() })),
  latestSummary: symptomSummarySchema.optional(),
});

export type SymptomSummary = z.infer<typeof symptomSummarySchema>;
export type SymptomAnalysis = z.infer<typeof symptomAnalysisSchema>;
export type SessionMemoryData = z.infer<typeof sessionMemorySchema>;
