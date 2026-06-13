import { TruGenClient } from './trugen/trugen.client.js';
import type { TruGenSessionConfig } from './trugen/types.js';

export class TruGenRealtimeService extends TruGenClient {
  constructor(apiKey: string, baseUrl: string, region?: string) {
    super(apiKey, baseUrl, region);
  }

  async startAvatarStream(
    consultationId: string,
    config: TruGenSessionConfig
  ): Promise<{ sessionId: string; streamUrl: string; stop: () => Promise<void> }> {
    if (!config.agentId) {
      throw new Error('TruGen agentId is required to start a session. Set TRUGEN_AGENT_ID.');
    }

    const session = await this.createSession(consultationId, config);
    await this.startStreaming(session.id);

    try {
      await this.connectAvatarStream(session.id);
    } catch (error) {
      console.warn('[TRUGEN] connectAvatarStream warning:', error);
    }

    const streamUrl = session.streamUrl || (await this.getSessionStatus(session.id)).streamUrl;
    if (!streamUrl) {
      throw new Error('TruGen did not return a stream URL for the avatar session.');
    }

    return {
      sessionId: session.id,
      streamUrl,
      stop: async () => {
        try {
          await this.endSession(session.id);
        } catch (e) {
          // ignore errors during stop
        }
      },
    };
  }

  async stopStream(sessionId: string) {
    try {
      await this.endSession(sessionId);
    } catch (e) {
      // ignore
    }
  }
}
