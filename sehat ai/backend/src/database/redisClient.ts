import IORedis from 'ioredis';
import { config } from '../config/index.js';

const Redis = (IORedis as any).default ?? IORedis;
const redisOptions = {
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  connectTimeout: 3000,
};

export const redisClient = new Redis(config.redisUrl, redisOptions);
redisClient.on('error', (error: Error) => {
  console.error('Redis client error:', error.message);
});

function createClient() {
  const client = new Redis(config.redisUrl, redisOptions);
  client.on('error', (error: Error) => {
    console.error('Redis client error:', error.message);
  });
  return client;
}

export function createRedisPublisher() {
  return createClient();
}

export function createRedisSubscriber() {
  return createClient();
}
