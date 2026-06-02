import { Request, Response } from 'express';
import { prisma } from '../database/client.js';
import { v4 as uuidv4 } from 'uuid';

export async function startConsultation(req: Request, res: Response) {
  const userId = (req as any).user.sub;
  const { language } = req.body || { language: 'en' };
  const session = await prisma.consultation.create({ data: { userId, language, status: 'started', startedAt: new Date() } });
  res.json({ ok: true, session });
}

export async function endConsultation(req: Request, res: Response) {
  const { consultationId } = req.body;
  if (!consultationId) return res.status(400).json({ ok: false, message: 'Missing consultationId' });
  const session = await prisma.consultation.update({ where: { id: consultationId }, data: { status: 'ended', endedAt: new Date() } });
  res.json({ ok: true, session });
}

export async function listSessions(req: Request, res: Response) {
  const userId = (req as any).user.sub;
  const sessions = await prisma.consultation.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  res.json({ ok: true, sessions });
}

export async function getSession(req: Request, res: Response) {
  const { id } = req.params;
  const session = await prisma.consultation.findUnique({ where: { id }, include: { transcripts: true, reports: true, agentLogs: true } });
  res.json({ ok: true, session });
}
