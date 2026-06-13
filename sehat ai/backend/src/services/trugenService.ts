import { TruGenClient } from '../video/trugen/trugen.client.js';
import type { TruGenSessionConfig, TruGenSession, TruGenStreamResponse } from '../video/trugen/types.js';

export type { TruGenSessionConfig, TruGenSession, TruGenStreamResponse };

export class TruGenService extends TruGenClient {
  constructor(apiKey: string, baseUrl: string, region?: string) {
    super(apiKey, baseUrl, region);
  }
}
