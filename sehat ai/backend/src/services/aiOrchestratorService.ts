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

export class AIOrchestratorService {
  private aiServiceUrl: string;
  private agentResponses: Map<string, AgentResponse[]> = new Map();

  constructor(aiServiceUrl: string = 'http://localhost:8000') {
    this.aiServiceUrl = aiServiceUrl;
  }

  async orchestrateConsultation(context: ConversationContext): Promise<OrchestrationResult> {
    try {
      // Step 1: Extract symptoms using AI
      const symptoms = await this.extractSymptoms(context);

      // Step 2: Assess severity and risk
      const riskAssessment = await this.assessRisk(symptoms, context);

      // Step 3: Check for safety issues
      const safetyCheck = await this.checkSafety(context, symptoms, riskAssessment);

      // Step 4: Generate recommendations
      const recommendations = await this.generateRecommendations(symptoms, riskAssessment, context);

      // Store agent logs
      await this.storeAgentLogs(context.consultationId, {
        symptoms,
        riskAssessment,
        safetyCheck,
        recommendations,
      });

      return {
        symptoms,
        riskAssessment,
        safetyIssues: safetyCheck.issues,
        recommendations,
        nextAction: safetyCheck.shouldEscalate ? 'emergency-escalation' : 'appointment-booking',
        shouldEscalate: safetyCheck.shouldEscalate,
        emergencyMessage: safetyCheck.emergencyMessage,
      };
    } catch (error) {
      console.error('Orchestration Error:', error);
      throw error;
    }
  }

  private async extractSymptoms(context: ConversationContext): Promise<Symptom[]> {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/agents/symptom`, {
        text: context.history.map(t => t.text).join(' '),
        language: context.language,
        consultationId: context.consultationId,
      });

      return response.data.symptoms || [];
    } catch (error) {
      console.error('Symptom Extraction Error:', error);
      return [];
    }
  }

  private async assessRisk(symptoms: Symptom[], context: ConversationContext): Promise<RiskAssessment> {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/agents/severity`, {
        symptoms,
        consultationId: context.consultationId,
        language: context.language,
      });

      return {
        riskScore: response.data.score || 0,
        level: response.data.level || 'low',
        confidence: response.data.confidence || 0.5,
        details: response.data.details,
      };
    } catch (error) {
      console.error('Risk Assessment Error:', error);
      return {
        riskScore: 0,
        level: 'low',
        confidence: 0,
      };
    }
  }

  private async checkSafety(
    context: ConversationContext,
    symptoms: Symptom[],
    riskAssessment: RiskAssessment
  ): Promise<{
    issues: string[];
    shouldEscalate: boolean;
    emergencyMessage?: string;
  }> {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/agents/safety`, {
        text: context.history.map(t => t.text).join(' '),
        symptoms,
        riskLevel: riskAssessment.level,
        consultationId: context.consultationId,
        language: context.language,
      });

      return {
        issues: response.data.issues || [],
        shouldEscalate: response.data.escalate || false,
        emergencyMessage: response.data.message,
      };
    } catch (error) {
      console.error('Safety Check Error:', error);
      return {
        issues: [],
        shouldEscalate: false,
      };
    }
  }

  private async generateRecommendations(
    symptoms: Symptom[],
    riskAssessment: RiskAssessment,
    context: ConversationContext
  ): Promise<string[]> {
    try {
      // Get hospital recommendations
      const hospitals = await this.findHospitals(symptoms, riskAssessment, context);

      // Generate appointment recommendations
      const appointments = await this.generateAppointmentAdvice(symptoms, context);

      // Generate general advice
      const advice = await this.generateMedicalAdvice(symptoms, context);

      return [
        ...advice,
        ...appointments,
        ...(hospitals.length > 0 ? [`Visit nearby hospital: ${hospitals[0].name}`] : []),
      ];
    } catch (error) {
      console.error('Recommendation Generation Error:', error);
      return [];
    }
  }

  private async findHospitals(
    symptoms: Symptom[],
    riskAssessment: RiskAssessment,
    context: ConversationContext
  ): Promise<any[]> {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/agents/hospital`, {
        symptoms,
        riskLevel: riskAssessment.level,
        consultationId: context.consultationId,
        language: context.language,
      });

      return response.data.hospitals || [];
    } catch (error) {
      console.error('Hospital Finding Error:', error);
      return [];
    }
  }

  private async generateAppointmentAdvice(symptoms: Symptom[], context: ConversationContext): Promise<string[]> {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/agents/appointment`, {
        symptoms,
        consultationId: context.consultationId,
        language: context.language,
      });

      return response.data.advice || [];
    } catch (error) {
      console.error('Appointment Advice Error:', error);
      return [];
    }
  }

  private async generateMedicalAdvice(symptoms: Symptom[], context: ConversationContext): Promise<string[]> {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/agents/advice`, {
        symptoms,
        consultationId: context.consultationId,
        language: context.language,
      });

      return response.data.advice || [];
    } catch (error) {
      console.error('Medical Advice Error:', error);
      return [];
    }
  }

  private async storeAgentLogs(consultationId: string, data: any): Promise<void> {
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
