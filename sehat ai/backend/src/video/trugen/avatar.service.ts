import { TruGenClient } from './trugen.client.js';
import { TruGenStreamResponse } from './types.js';

export class AvatarService {
  constructor(private trugen: TruGenClient) {}

  async createAvatarInstance(consultationId: string, avatarId: string, language: string): Promise<any> {
    return this.trugen.createSession(consultationId, {
      avatarId,
      language,
      quality: 'high',
    });
  }

  async speak(sessionId: string, text: string, language: string, emotion: 'happy' | 'sad' | 'neutral' | 'concerned' = 'neutral'): Promise<TruGenStreamResponse> {
    return this.trugen.generateSpeech(sessionId, text, language, emotion);
  }

  async stopAvatar(sessionId: string): Promise<void> {
    return this.trugen.endSession(sessionId);
  }
}
