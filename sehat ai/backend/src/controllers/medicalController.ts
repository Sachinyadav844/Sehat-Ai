import { Request, Response } from 'express';
import { AIService } from '../services/aiService.js';

const aiService = new AIService();

export async function medicalRetrieve(req: Request, res: Response) {
  try {
    const { query, language = 'en' } = req.body;
    const data = await aiService.medicalRetrieve(query, language);
    res.json({ ok: true, ...data });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

export async function medicalValidate(req: Request, res: Response) {
  try {
    const { query, language = 'en', expected = [] } = req.body;
    const data = await aiService.medicalValidate(query, language, expected);
    res.json({ ok: true, ...data });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message });
  }
}
