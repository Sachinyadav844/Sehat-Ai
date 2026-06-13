import { Router } from 'express';
import { prisma } from '../database/client.js';
import { Redis } from 'ioredis';
import { config } from '../config/index.js';

export const healthRouter = Router();

healthRouter.get('/', async (req, res) => {
  const result: any = { ok: true, uptime: process.uptime() };

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    result.database = { ok: true };
  } catch (err) {
    result.database = { ok: false, error: String(err) };
    result.ok = false;
  }

  // Check redis
  try {
    const r = new Redis(config.redisUrl);
    const pong = await r.ping();
    await r.quit();
    result.redis = { ok: pong === 'PONG' };
    if (pong !== 'PONG') result.ok = false;
  } catch (err) {
    result.redis = { ok: false, error: String(err) };
    result.ok = false;
  }

  // Check AI config
  try {
    result.ai = { ok: Boolean(config.openaiKey || config.trugen.apiKey) };
    if (!result.ai.ok) result.ok = false;
  } catch (err) {
    result.ai = { ok: false, error: String(err) };
    result.ok = false;
  }

  // websocket (best-effort)
  result.websocket = { ok: true };

  res.json(result);
});
