import { Request, Response } from 'express';
import { AIGatewayService } from './aiGateway.service.js';

const aiGatewayService = new AIGatewayService();

export async function sendTranscript(req: Request, res: Response) {
  try {
    const userId = (req as any).user.sub;
    const { consultationId, transcript, language, history } = req.body;

    if (!consultationId || !transcript) {
      return res.status(400).json({ ok: false, message: 'Missing consultationId or transcript' });
    }

    const result = await aiGatewayService.sendTranscript(consultationId, transcript, language || 'en', history || []);

    res.json({ ok: true, validatedResponse: result });
  } catch (error) {
    console.error('AI Gateway error:', error);
    res.status(500).json({ ok: false, message: 'Failed to forward transcript', error: (error as Error).message });
  }
}
