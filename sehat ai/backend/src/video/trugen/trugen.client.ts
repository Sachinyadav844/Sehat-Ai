import axios, { AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { TruGenSessionConfig, TruGenSession, TruGenStreamResponse } from './types.js';

export class TruGenClient {
  private client: AxiosInstance;
  private apiKey: string;
  private baseUrl: string;
  private region?: string;

  constructor(apiKey: string, baseUrl: string, region?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.region = region;
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
    const sessionId = uuidv4();
    const response = await this.client.post('/sessions', {
      sessionId,
      agentId: config.agentId,
      avatarId: config.avatarId ?? '',
      language: config.language,
      quality: config.quality || 'high',
      bitrate: config.bitrate || 2048,
      region: config.region || this.region,
    });

    return {
      id: sessionId,
      consultationId,
      avatarId: config.avatarId ?? '',
      status: 'initialized',
      streamUrl: response.data.streamUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async startStreaming(sessionId: string): Promise<void> {
    await this.client.post(`/sessions/${sessionId}/start`);
  }

  async pauseSession(sessionId: string): Promise<void> {
    await this.client.post(`/sessions/${sessionId}/pause`);
  }

  async resumeSession(sessionId: string): Promise<void> {
    await this.client.post(`/sessions/${sessionId}/resume`);
  }

  async endSession(sessionId: string): Promise<void> {
    await this.client.post(`/sessions/${sessionId}/end`);
  }

  async generateSpeech(sessionId: string, text: string, language: string, emotion: 'happy' | 'sad' | 'neutral' | 'concerned' = 'neutral'): Promise<TruGenStreamResponse> {
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
  }

  async generateSpeechWithEmotion(sessionId: string, text: string, language: string, emotion: 'happy' | 'sad' | 'neutral' | 'concerned' = 'neutral') {
    return this.generateSpeech(sessionId, text, language, emotion);
  }

  async listAvailableAvatars(): Promise<any[]> {
    const response = await this.client.get('/avatars');
    return response.data.avatars || [];
  }

  async getSessionStatus(sessionId: string): Promise<TruGenSession> {
    const response = await this.client.get(`/sessions/${sessionId}/status`);
    return {
      id: sessionId,
      consultationId: response.data.consultationId,
      avatarId: response.data.avatarId,
      status: response.data.status,
      streamUrl: response.data.streamUrl,
      createdAt: new Date(response.data.createdAt || Date.now()),
      updatedAt: new Date(response.data.updatedAt || Date.now()),
    };
  }

  async streamAudio(sessionId: string, audioBuffer: Buffer): Promise<any> {
    const chunk = audioBuffer.toString('base64');
    const response = await this.client.post(`/sessions/${sessionId}/audio`, { chunk });
    return response.data;
  }

  async connectAvatarStream(sessionId: string): Promise<any> {
    const response = await this.client.post(`/sessions/${sessionId}/connect`);
    return response.data;
  }
}
