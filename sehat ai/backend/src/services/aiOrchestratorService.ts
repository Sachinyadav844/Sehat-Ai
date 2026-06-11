import axios from 'axios';
import { ConversationContext, Symptom, RiskAssessment } from '../types/consultation.js';
import { prisma } from '../database/client.js';

export interface AgentResponse {
  agent: string;
  confidence: number;
  data: any;
  timestamp: Date;
}

export interface OrchestrationResult {
  symptoms: Symptom[];
  riskAssessment: RiskAssessment;
  safetyIssues?: string[];
  recommendations?: string[];
  nextAction?: string;
  shouldEscalate?: boolean;
  emergencyMessage?: string;
}

interface OrchestratorWorkflowResult {
  workflowId: string;
  sessionId: string;
  conversationId: string;
  language: string;
  workflowStatus: string;
  activeAgent?: string;
  workflowHistory?: unknown[];
  response?: {
    summary?: string;
    symptoms?: Array<Symptom | string>;
    risk?: string;
    riskScore?: number;
    confidence?: string;
    recommendation?: string;
    recommendations?: string[];
    nextAction?: string;
    emergencyMessage?: string;
    safetyIssues?: string[];
    metadata?: Record<string, unknown>;
  };
  emergencyDetected?: boolean;
}

export class AIOrchestratorService {
  private aiServiceUrl: string;
  private agentResponses: Map<string, AgentResponse[]> = new Map();

  constructor(aiServiceUrl: string = 'http://localhost:8000') {
    this.aiServiceUrl = aiServiceUrl.replace(/\/$/, '');
  }

  async orchestrateConsultation(context: ConversationContext): Promise<OrchestrationResult> {
    try {
      const requestPayload = {
        sessionId: context.consultationId,
        conversationId: context.consultationId,
        language: context.language,
        input:
          context.history.length > 0
            ? context.history.map((entry) => `${entry.speaker}: ${entry.text}`).join('\n')
            : context.consultationId,
        metadata: {
          conversationHistory: context.history.map((entry) => ({
            speaker: entry.speaker,
            text: entry.text,
            timestamp: entry.timestamp,
          })),
        },
      };

      const response = await axios.post<OrchestratorWorkflowResult>(`${this.aiServiceUrl}/process`, requestPayload, {
        timeout: 15000,
      });

      const workflowResult = response.data;
      await this.storeAgentLogs(context.consultationId, {
        request: requestPayload,
        workflowResult,
      });

      return this.mapWorkflowResult(workflowResult);
    } catch (error) {
      console.error('Orchestration Error:', error);
      throw error;
    }
  }

  private mapWorkflowResult(workflowResult: OrchestratorWorkflowResult): OrchestrationResult {
    const response = workflowResult.response || {};
    const symptoms: Symptom[] = Array.isArray(response.symptoms)
      ? response.symptoms.map((value) => {
          if (typeof value === 'string') {
            return { id: '', name: value };
          }
          return {
            id: (value as Symptom).id || '',
            name: (value as Symptom).name || String(value),
            duration: (value as Symptom).duration,
            severity: (value as Symptom).severity,
            reported: (value as Symptom).reported,
          };
        })
      : [];

    const riskAssessment: RiskAssessment = {
      riskScore: typeof response.riskScore === 'number' ? response.riskScore : 0,
      level: typeof response.risk === 'string' ? (response.risk as RiskAssessment['level']) : 'low',
      confidence: response.confidence ? Number(response.confidence) || 0 : 0,
      details:
        typeof response?.metadata?.details === 'string'
          ? (response.metadata.details as string)
          : undefined,
    };

    const recommendations = Array.isArray(response.recommendations)
      ? response.recommendations
      : response.recommendation
      ? [response.recommendation]
      : [];

    return {
      symptoms,
      riskAssessment,
      safetyIssues: Array.isArray(response.safetyIssues) ? response.safetyIssues : [],
      recommendations,
      nextAction:
        response.nextAction ??
        (workflowResult.emergencyDetected ? 'emergency-escalation' : 'appointment-booking'),
      shouldEscalate: workflowResult.emergencyDetected ?? false,
      emergencyMessage: response.emergencyMessage,
    };
  }

  private async storeAgentLogs(consultationId: string, data: unknown): Promise<void> {
    try {
      await prisma.agentLog.create({
        data: {
          consultationId,
          agentName: 'orchestrator',
          payload: JSON.stringify(data),
        },
      });
    } catch (error) {
      console.error('Store Agent Logs Error:', error);
    }
  }

  async generateReport(consultationId: string): Promise<string> {
    try {
      const consultation = await prisma.consultation.findUnique({
        where: { id: consultationId },
        include: {
          transcripts: true,
          symptoms: true,
          risk: true,
          reports: true,
        },
      });

      if (!consultation) throw new Error('Consultation not found');

      const response = await axios.post(`${this.aiServiceUrl}/agents/report`, {
        consultationId,
        consultation: JSON.stringify(consultation),
      });

      return response.data.report || '';
    } catch (error) {
      console.error('Report Generation Error:', error);
      throw error;
    }
  }

  async translateText(text: string, language: string): Promise<string> {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/agents/translate`, {
        text,
        language,
      });

      return response.data.translatedText || text;
    } catch (error) {
      console.error('Translation Error:', error);
      return text;
    }
  }
}
