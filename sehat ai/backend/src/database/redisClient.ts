import Redis from 'ioredis';
import { config } from '../config/index.js';

export const redisClient = new Redis(config.redisUrl);

export function createRedisPublisher() {
  return new Redis(config.redisUrl);
}

export function createRedisSubscriber() {
  return new Redis(config.redisUrl);
}
