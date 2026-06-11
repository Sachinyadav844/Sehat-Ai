import * as pino from 'pino';
import { env } from '../config/env.js';

const level = env.nodeEnv === 'production' ? 'info' : 'debug';
const PinoFactory = (pino as any).default ?? pino;

export const logger = PinoFactory({
  level,
  transport:
    env.nodeEnv === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        }
      : undefined,
});
