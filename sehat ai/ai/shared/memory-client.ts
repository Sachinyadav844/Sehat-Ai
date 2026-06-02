import Redis from "ioredis";

export class MemoryClient {
  client: Redis;

  constructor(redisUrl = process.env.REDIS_URL || "redis://localhost:6379") {
    this.client = new Redis(redisUrl);
  }

  async setKey(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, payload, "EX", ttlSeconds);
      return;
    }
    await this.client.set(key, payload);
  }

  async getKey<T = unknown>(key: string): Promise<T | null> {
    const result = await this.client.get(key);
    return result ? (JSON.parse(result) as T) : null;
  }

  async deleteKey(key: string): Promise<void> {
    await this.client.del(key);
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}
