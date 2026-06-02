import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envCandidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(process.cwd(), '../../.env'),
  path.resolve(process.cwd(), '../../../.env'),
];

const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));
if (envPath) {
  dotenv.config({ path: envPath });
} else {
  console.warn('No .env file found in expected locations:', envCandidates);
}

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  databaseUrl: process.env.DATABASE_URL || '',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  openaiKey: process.env.OPENAI_API_KEY || '',
  trugen: {
    apiKey: process.env.TRUGEN_API_KEY || '',
    baseUrl: process.env.TRUGEN_BASE_URL || '',
    apiSecret: process.env.TRUGEN_API_SECRET || process.env.TRUGEN_SECRET || '',
    agentId: process.env.TRUGEN_AGENT_ID || '',
    avatarId: process.env.TRUGEN_AVATAR_ID || '',
    region: process.env.TRUGEN_REGION || '',
  },
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  aiGatewayUrl: process.env.AI_GATEWAY_URL || process.env.AI_SERVICE_URL || 'http://localhost:8000',
  s3: {
    endpoint: process.env.S3_ENDPOINT || '',
    accessKey: process.env.S3_ACCESS_KEY || '',
    secretKey: process.env.S3_SECRET_KEY || '',
    bucket: process.env.S3_BUCKET || ''
  }
}
