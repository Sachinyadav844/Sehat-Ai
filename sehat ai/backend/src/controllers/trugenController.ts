import { Request, Response } from 'express';
import axios from 'axios';
import { config } from '../config/index.js';

export async function createTrugenSession(req: Request, res: Response) {
  // Create a TruGen session via their API
  const payload = req.body || {};
  const r = await axios.post(`${config.trugen.baseUrl}/sessions`, payload, { headers: { Authorization: `Bearer ${config.trugen.apiKey}` } });
  res.json({ ok: true, session: r.data });
}

export async function streamAudio(req: Request, res: Response) {
  // Webhook-style proxy to TruGen audio ingest
  const { sessionId, chunk } = req.body;
  const r = await axios.post(`${config.trugen.baseUrl}/sessions/${sessionId}/audio`, { chunk }, { headers: { Authorization: `Bearer ${config.trugen.apiKey}` } });
  res.json({ ok: true, result: r.data });
}

export async function avatarSpeak(req: Request, res: Response) {
  const { sessionId, text, lang } = req.body;
  const r = await axios.post(`${config.trugen.baseUrl}/sessions/${sessionId}/speak`, { text, lang }, { headers: { Authorization: `Bearer ${config.trugen.apiKey}` } });
  res.json({ ok: true, result: r.data });
}
