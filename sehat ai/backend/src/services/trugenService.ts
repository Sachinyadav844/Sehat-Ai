import axios, { AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface TruGenSessionConfig {
  avatarId: string;
  language: string;
  quality?: 'low' | 'medium' | 'high';
  bitrate?: number;
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

export class TruGenService {
  private client: AxiosInstance;
  private apiKey: string;
  private baseUrl: string;
  private sessions: Map<string, TruGenSession> = new Map();

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;

    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async createSession(consultationId: string, config: TruGenSessionConfig): Promise<TruGenSession> {
    try {
      const sessionId = uuidv4();
      const response = await this.client.post('/sessions', {
        sessionId,
        avatarId: config.avatarId,
        language: config.language,
        quality: config.quality || 'high',
        bitrate: config.bitrate || 2048,
      });

      const session: TruGenSession = {
        id: sessionId,
        consultationId,
        avatarId: config.avatarId,
        status: 'initialized',
        streamUrl: response.data.streamUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.sessions.set(sessionId, session);
      return session;
    } catch (error) {
      console.error('TruGen Session Creation Error:', error);
      throw error;
    }
  }

  async startStreaming(sessionId: string): Promise<void> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) throw new Error('Session not found');

      await this.client.post(`/sessions/${sessionId}/start`);
      session.status = 'streaming';
      session.updatedAt = new Date();
    } catch (error) {
      console.error('TruGen Start Streaming Error:', error);
      throw error;
    }
  }

  async generateSpeech(sessionId: string, text: string, language: string): Promise<TruGenStreamResponse> {
    try {
      const response = await this.client.post(`/sessions/${sessionId}/speak`, {
        text,
        language,
        speed: 1.0,
        emotion: 'neutral',
        lipSync: true,
      });

      return {
        streamId: response.data.streamId,
        videoUrl: response.data.videoUrl,
        audioUrl: response.data.audioUrl,
        duration: response.data.duration || 0,
        status: response.data.status || 'success',
      };
    } catch (error) {
      console.error('TruGen Speech Generation Error:', error);
      throw error;
    }
  }

  async generateSpeechWithEmotion(
    sessionId: string,
    text: string,
    language: string,
    emotion: 'happy' | 'sad' | 'neutral' | 'concerned' = 'neutral'
  ): Promise<TruGenStreamResponse> {
    try {
      const response = await this.client.post(`/sessions/${sessionId}/speak`, {
        text,
        language,
        emotion,
        lipSync: true,
        speed: 1.0,
      });

      return {
        streamId: response.data.streamId,
        videoUrl: response.data.videoUrl,
        audioUrl: response.data.audioUrl,
        duration: response.data.duration || 0,
        status: response.data.status || 'success',
      };
    } catch (error) {
      console.error('TruGen Speech with Emotion Error:', error);
      throw error;
    }
  }

  async pauseSession(sessionId: string): Promise<void> {
    try {
      await this.client.post(`/sessions/${sessionId}/pause`);
      const session = this.sessions.get(sessionId);
      if (session) {
        session.status = 'paused';
        session.updatedAt = new Date();
      }
    } catch (error) {
      console.error('TruGen Pause Error:', error);
      throw error;
    }
  }

  async resumeSession(sessionId: string): Promise<void> {
    try {
      await this.client.post(`/sessions/${sessionId}/resume`);
      const session = this.sessions.get(sessionId);
      if (session) {
        session.status = 'streaming';
        session.updatedAt = new Date();
      }
    } catch (error) {
      console.error('TruGen Resume Error:', error);
      throw error;
    }
  }

  async endSession(sessionId: string): Promise<void> {
    try {
      await this.client.post(`/sessions/${sessionId}/end`);
      const session = this.sessions.get(sessionId);
      if (session) {
        session.status = 'ended';
        session.updatedAt = new Date();
      }
    } catch (error) {
      console.error('TruGen End Session Error:', error);
      throw error;
    }
  }

  async listAvailableAvatars(): Promise<any[]> {
    try {
      const response = await this.client.get('/avatars');
      return response.data.avatars || [];
    } catch (error) {
      console.error('TruGen List Avatars Error:', error);
      throw error;
    }
  }

  async getSessionStatus(sessionId: string): Promise<TruGenSession | undefined> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) return undefined;

      const response = await this.client.get(`/sessions/${sessionId}/status`);
      session.status = response.data.status;
      session.updatedAt = new Date();
      return session;
    } catch (error) {
      console.error('TruGen Get Status Error:', error);
      return this.sessions.get(sessionId);
    }
  }

  getLocalSession(sessionId: string): TruGenSession | undefined {
    return this.sessions.get(sessionId);
  }
}
