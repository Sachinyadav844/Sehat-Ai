export interface TruGenSessionConfig {
  avatarId?: string;
  agentId?: string;
  language: string;
  quality?: 'low' | 'medium' | 'high';
  bitrate?: number;
  region?: string;
}

export interface TruGenSession {
  id: string;
  consultationId: string;
  avatarId: string;
  status: 'initialized' | 'streaming' | 'paused' | 'ended';
  streamUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TruGenStreamResponse {
  streamId: string;
  videoUrl: string;
  audioUrl: string;
  duration: number;
  status: 'success' | 'error';
}

export interface TruGenTokenPayload {
  sessionId: string;
  expiresAt: number;
}
