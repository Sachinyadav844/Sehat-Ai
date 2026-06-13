import { Request, Response } from 'express';
import { AIService } from '../services/aiService.js';

const aiService = new AIService();

export async function ragSearch(req: Request, res: Response) {
  try {
    const { query, language = 'en', emergency = false } = req.body;
    const data = await aiService.ragSearch(query, language, emergency);
    res.json({ ok: true, ...data });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

export async function ragContext(req: Request, res: Response) {
  try {
    const { query, language = 'en' } = req.body;
    const data = await aiService.ragContext(query, language);
    res.json({ ok: true, ...data });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

export async function ragEmergency(req: Request, res: Response) {
  try {
    const { query, language = 'en' } = req.body;
    const data = await aiService.ragEmergency(query, language);
    res.json({ ok: true, ...data });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

export async function ragMultilingual(req: Request, res: Response) {
  try {
    const { query, language = 'en' } = req.body;
    const data = await aiService.ragMultilingual(query, language);
    res.json({ ok: true, ...data });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message });
  }
}
