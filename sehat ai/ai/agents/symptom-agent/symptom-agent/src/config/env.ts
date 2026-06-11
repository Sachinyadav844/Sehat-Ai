import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  port: Number(process.env.PORT || 5001),
  nodeEnv: process.env.NODE_ENV || 'development',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  openAiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  redisUrl: process.env.REDIS_URL || '',
  sessionTtl: Number(process.env.SESSION_TTL_SECONDS || 3600),
  apiKey: process.env.SYMP_AGENT_API_KEY || ''
};
