import { config } from '../../config/index.js';
import { SpeechToTextService } from '../../services/mediaService.js';

export interface SpeechTranscript {
  transcript: string;
  language: string;
  confidence: number;
}

export class SpeechService {
  private sttService = new SpeechToTextService(config.openaiKey);

  static supportedLanguages = ['en', 'hi', 'ur', 'bn', 'ta', 'te', 'mr', 'gu', 'pa', 'ar'];

  async transcribeAudioBuffer(audioBuffer: Buffer, language?: string): Promise<SpeechTranscript> {
    const detectLanguage = language || 'en';
    const result = await this.sttService.transcribeStream(audioBuffer, detectLanguage);

    return {
      transcript: result.text,
      language: result.language || detectLanguage,
      confidence: result.confidence || 0.9,
    };
  }

  detectLanguage(audioBuffer: Buffer): string {
    return 'en';
  }
}
