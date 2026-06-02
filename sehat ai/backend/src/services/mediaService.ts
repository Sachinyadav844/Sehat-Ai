import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export interface STTResult {
  text: string;
  language: string;
  confidence: number;
  duration: number;
}

export interface TTSResult {
  audioUrl: string;
  duration: number;
  format: string;
}

export class SpeechToTextService {
  private openaiKey: string;
  private model: string = 'whisper-1';

  constructor(openaiKey: string) {
    this.openaiKey = openaiKey;
  }

  async transcribe(audioPath: string, language?: string): Promise<STTResult> {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(audioPath));
      form.append('model', this.model);
      if (language) {
        form.append('language', language);
      }

      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${this.openaiKey}`,
        },
      });

      return {
        text: response.data.text,
        language: response.data.language || language || 'en',
        confidence: 0.95,
        duration: 0,
      };
    } catch (error) {
      console.error('STT Error:', error);
      throw error;
    }
  }

  async transcribeStream(audioBuffer: Buffer, language?: string): Promise<STTResult> {
    try {
      const form = new FormData();
      form.append('file', audioBuffer, 'audio.wav');
      form.append('model', this.model);
      if (language) {
        form.append('language', language);
      }

      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${this.openaiKey}`,
        },
      });

      return {
        text: response.data.text,
        language: response.data.language || language || 'en',
        confidence: 0.95,
        duration: 0,
      };
    } catch (error) {
      console.error('STT Stream Error:', error);
      throw error;
    }
  }
}

export class TextToSpeechService {
  private openaiKey: string;
  private model: string = 'tts-1-hd';
  private voice: string = 'nova';

  constructor(openaiKey: string) {
    this.openaiKey = openaiKey;
  }

  async synthesize(text: string, language: string = 'en'): Promise<Buffer> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        {
          model: this.model,
          input: text,
          voice: this.selectVoiceForLanguage(language),
          response_format: 'wav',
          speed: 1.0,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiKey}`,
          },
          responseType: 'arraybuffer',
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('TTS Error:', error);
      throw error;
    }
  }

  private selectVoiceForLanguage(language: string): string {
    const voiceMap: Record<string, string> = {
      en: 'nova',
      hi: 'nova',
      ur: 'nova',
      bn: 'nova',
      ta: 'nova',
      te: 'nova',
      mr: 'nova',
    };
    return voiceMap[language] || 'nova';
  }

  async synthesizeMultilingual(text: string, language: string): Promise<Buffer> {
    // For multilingual support, we might use Google Cloud or Azure
    // For now, using OpenAI's TTS with language selection
    return this.synthesize(text, language);
  }
}

export class AudioStreamProcessor {
  private chunkBuffer: Buffer[] = [];
  private targetSampleRate: number = 16000;

  addChunk(chunk: Buffer) {
    this.chunkBuffer.push(chunk);
  }

  getBuffer(): Buffer {
    return Buffer.concat(this.chunkBuffer);
  }

  clearBuffer() {
    this.chunkBuffer = [];
  }

  getChunkCount(): number {
    return this.chunkBuffer.length;
  }

  getBufferSize(): number {
    return this.getBuffer().length;
  }
}
