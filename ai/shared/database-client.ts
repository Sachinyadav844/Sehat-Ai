import { MongoClient } from "mongodb";
import { Client } from "pg";
import Redis from "ioredis";

export class DatabaseClient {
  public postgres: Client;
  public mongo: MongoClient;
  public redis: Redis;

  constructor() {
    this.postgres = new Client({
      connectionString: process.env.DATABASE_URL || "postgresql://sehat_user:sehat_password@localhost:5432/sehatdb"
    });
    this.mongo = new MongoClient(process.env.MONGO_URL || "mongodb://localhost:27017/sehat");
    this.redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
  }

  async connect(): Promise<void> {
    await Promise.all([this.postgres.connect(), this.mongo.connect(), this.redis.connect()]);
  }

  async disconnect(): Promise<void> {
    await Promise.all([this.postgres.end(), this.mongo.close(), this.redis.quit()]);
  }
}
