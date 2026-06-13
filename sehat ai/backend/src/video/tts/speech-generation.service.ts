import { config } from '../../config/index.js';
import { TextToSpeechService } from '../../services/mediaService.js';
import { TruGenClient } from '../trugen/trugen.client.js';

export interface GeneratedSpeechResult {
  audioBuffer: Buffer;
  language: string;
  durationMs: number;
}

export class SpeechGenerationService {
  private ttsService = new TextToSpeechService(config.openaiKey);
  private trugenClient: TruGenClient;

  constructor() {
    this.trugenClient = new TruGenClient(config.trugen.apiKey, config.trugen.baseUrl, config.trugen.region);
  }

  async generateAudio(text: string, language: string): Promise<GeneratedSpeechResult> {
    const audioBuffer = await this.ttsService.synthesizeMultilingual(text, language);
    return {
      audioBuffer,
      language,
      durationMs: Math.round((audioBuffer.length / 32000) * 1000),
    };
  }

  async streamToAvatar(sessionId: string, audioBuffer: Buffer): Promise<any> {
    return this.trugenClient.streamAudio(sessionId, audioBuffer);
  }
}
