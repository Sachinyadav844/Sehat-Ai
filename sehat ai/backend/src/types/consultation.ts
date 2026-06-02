export interface ConsultationSession {
  id: string;
  userId: string;
  status: 'initialized' | 'started' | 'processing' | 'completed' | 'ended';
  language: string;
  startedAt?: Date;
  endedAt?: Date;
  symptoms: Symptom[];
  riskAssessment?: RiskAssessment;
  transcripts: Transcript[];
}

export interface Symptom {
  id: string;
  name: string;
  duration?: string;
  severity?: string;
  reported?: boolean;
}

export interface RiskAssessment {
  riskScore: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  details?: string;
}

export interface Transcript {
  id: string;
  speaker: 'patient' | 'ai' | 'system';
  text: string;
  language: string;
  timestamp: Date;
}

export interface ConversationContext {
  consultationId: string;
  language: string;
  symptoms: Symptom[];
  riskLevel: string;
  history: Transcript[];
  metadata: Record<string, any>;
}

export interface AvatarSession {
  id: string;
  consultationId: string;
  trugenSessionId: string;
  status: 'initialized' | 'streaming' | 'ended';
  startedAt: Date;
  endedAt?: Date;
}

export interface EmergencyAlert {
  id: string;
  consultationId: string;
  type: 'safety' | 'severity' | 'medical';
  message: string;
  resolved: boolean;
  createdAt: Date;
}

export interface MedicalReport {
  id: string;
  consultationId: string;
  summary: string;
  symptoms: Symptom[];
  riskScore: number;
  recommendations: string[];
  hospitals?: any[];
  pdfUrl?: string;
}
