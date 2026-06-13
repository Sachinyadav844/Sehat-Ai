import Redis from "ioredis";
import { DashboardEvent } from "../message-schema";

export class EventBus {
  private publisher: Redis;
  private subscriber: Redis;

  constructor(redisUrl = process.env.REDIS_URL || "redis://localhost:6379") {
    this.publisher = new Redis(redisUrl);
    this.subscriber = new Redis(redisUrl);
  }

  async publish(channel: string, event: DashboardEvent): Promise<void> {
    await this.publisher.publish(channel, JSON.stringify(event));
  }

  async subscribe(channel: string, handler: (event: DashboardEvent) => void): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on("message", (_channel, message) => {
      if (_channel !== channel) return;
      try {
        const event = JSON.parse(message) as DashboardEvent;
        handler(event);
      } catch (error) {
        console.warn("Failed to parse event message", error);
      }
    });
  }

  async close(): Promise<void> {
    await Promise.all([this.publisher.quit(), this.subscriber.quit()]);
  }
}
