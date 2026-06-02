import IORedis from 'ioredis';
import { config } from '../config/index.js';

const Redis = (IORedis as any).default ?? IORedis;

export const redisClient = new Redis(config.redisUrl);

export function createRedisPublisher() {
  return new Redis(config.redisUrl);
}

export function createRedisSubscriber() {
  return new Redis(config.redisUrl);
}
