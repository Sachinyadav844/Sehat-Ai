import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  databaseUrl: process.env.DATABASE_URL || '',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  openaiKey: process.env.OPENAI_API_KEY || '',
  trugen: {
    apiKey: process.env.TRUGEN_API_KEY || '',
    baseUrl: process.env.TRUGEN_BASE_URL || ''
  },
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  s3: {
    endpoint: process.env.S3_ENDPOINT || '',
    accessKey: process.env.S3_ACCESS_KEY || '',
    secretKey: process.env.S3_SECRET_KEY || '',
    bucket: process.env.S3_BUCKET || ''
  }
}
