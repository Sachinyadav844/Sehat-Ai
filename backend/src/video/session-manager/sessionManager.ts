import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../../database/redisClient.js';
import { prisma } from '../../database/client.js';

export interface VideoSessionRecord {
  id: string;
  consultationId: string;
  userId: string;
  language: string;
  status: 'initialized' | 'active' | 'paused' | 'streaming' | 'ended' | 'reconnecting';
  avatarId?: string;
  trugenSessionId?: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

export class VideoSessionManager {
  private readonly sessionPrefix = 'video:session:';
  private readonly participantsPrefix = 'video:participants:';
  private readonly trugenMappingPrefix = 'video:trugen:';
  private readonly ttlSeconds = 86400;

  private sessionKey(consultationId: string) {
    return `${this.sessionPrefix}${consultationId}`;
  }

  private participantKey(consultationId: string) {
    return `${this.participantsPrefix}${consultationId}`;
  }

  private trugenMappingKey(trugenSessionId: string) {
    return `${this.trugenMappingPrefix}${trugenSessionId}`;
  }

  async createSession(
    consultationId: string,
    userId: string,
    language: string,
    avatarId?: string,
    trugenSessionId?: string
  ): Promise<VideoSessionRecord> {
    const sessionId = uuidv4();
    const session: VideoSessionRecord = {
      id: sessionId,
      consultationId,
      userId,
      language,
      status: 'initialized',
      avatarId,
      trugenSessionId,
      participants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await redisClient.set(this.sessionKey(consultationId), JSON.stringify(session), 'EX', this.ttlSeconds);

    if (trugenSessionId) {
      await redisClient.set(this.trugenMappingKey(trugenSessionId), consultationId, 'EX', this.ttlSeconds);
    }

    const existing = await prisma.$queryRaw<Array<{ id: string }>>
      `SELECT id FROM "VideoSession" WHERE "consultationId" = ${consultationId} LIMIT 1`;

    if (existing.length > 0) {
      await prisma.$executeRaw`
        UPDATE "VideoSession" SET "status" = 'initialized', "startedAt" = ${new Date()}, "updatedAt" = ${new Date()}
        WHERE "consultationId" = ${consultationId}`;
    } else {
      await prisma.$executeRaw`
        INSERT INTO "VideoSession" ("id", "consultationId", "sessionUrl", "status", "startedAt", "updatedAt")
        VALUES (${sessionId}, ${consultationId}, '', 'initialized', ${new Date()}, ${new Date()})`;
    }

    return session;
  }

  async getSession(consultationId: string): Promise<VideoSessionRecord | null> {
    const value = await redisClient.get(this.sessionKey(consultationId));
    if (!value) {
      return null;
    }
    return JSON.parse(value) as VideoSessionRecord;
  }

  async getSessionByTruGenSessionId(trugenSessionId: string): Promise<VideoSessionRecord | null> {
    const consultationId = await redisClient.get(this.trugenMappingKey(trugenSessionId));
    if (!consultationId) {
      return null;
    }
    return this.getSession(consultationId);
  }

  async joinSession(consultationId: string, socketId: string): Promise<string[]> {
    const session = await this.getSession(consultationId);
    if (!session) {
      throw new Error('Session not found');
    }

    await redisClient.sadd(this.participantKey(consultationId), socketId);
    const participants = await this.trackParticipants(consultationId);
    session.participants = participants;
    session.status = 'active';
    session.updatedAt = new Date().toISOString();
    await redisClient.set(this.sessionKey(consultationId), JSON.stringify(session), 'EX', this.ttlSeconds);

    return participants;
  }

  async leaveSession(consultationId: string, socketId: string): Promise<string[]> {
    await redisClient.srem(this.participantKey(consultationId), socketId);
    const participants = await this.trackParticipants(consultationId);
    const session = await this.getSession(consultationId);
    if (session) {
      session.participants = participants;
      session.updatedAt = new Date().toISOString();
      await redisClient.set(this.sessionKey(consultationId), JSON.stringify(session), 'EX', this.ttlSeconds);
    }
    return participants;
  }

  async reconnectSession(consultationId: string, socketId: string): Promise<string[]> {
    return this.joinSession(consultationId, socketId);
  }

  async endSession(consultationId: string): Promise<void> {
    const session = await this.getSession(consultationId);
    if (!session) {
      return;
    }

    session.status = 'ended';
    session.updatedAt = new Date().toISOString();
    await redisClient.set(this.sessionKey(consultationId), JSON.stringify(session), 'EX', this.ttlSeconds);
    await prisma.$executeRaw`
      UPDATE "VideoSession"
      SET "status" = 'ended', "endedAt" = ${new Date()}, "updatedAt" = ${new Date()}
      WHERE "consultationId" = ${consultationId}`;
    await redisClient.del(this.participantKey(consultationId));
  }

  async trackParticipants(consultationId: string): Promise<string[]> {
    const participants = await redisClient.smembers(this.participantKey(consultationId));
    return participants || [];
  }

  async updateSession(consultationId: string, data: Partial<VideoSessionRecord>): Promise<VideoSessionRecord | null> {
    const session = await this.getSession(consultationId);
    if (!session) {
      return null;
    }

    const updatedSession: VideoSessionRecord = {
      ...session,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await redisClient.set(this.sessionKey(consultationId), JSON.stringify(updatedSession), 'EX', this.ttlSeconds);
    return updatedSession;
  }
}
