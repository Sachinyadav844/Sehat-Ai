import { Router, Request, Response } from 'express';
import { SeverityService } from '../core/severity.service';
import { riskLevels } from '../models/risk.model';
import { validateSeverityRequest } from '../validators/symptom.validator';
import { logEvent } from '../logging';

const router = Router();
const service = new SeverityService();

router.post('/severity/analyze', async (req: Request, res: Response) => {
  const validation = validateSeverityRequest(req.body);
  if (!validation.valid) {
    logEvent('Errors', { validationErrors: validation.errors });
    return res.status(400).json({ errors: validation.errors });
  }

  try {
    const response = await service.analyzeSeverity(req.body);
    return res.json(response);
  } catch (error) {
    logEvent('Errors', { message: (error as Error).message });
    return res.status(500).json({ error: 'Failed to analyze severity.' });
  }
});

router.get('/health', (_req: Request, res: Response) => {
  res.json({ service: 'severity-agent', status: 'healthy' });
});

router.get('/rules', (_req: Request, res: Response) => {
  res.json({ enabled: ['low-risk', 'moderate-risk', 'high-risk', 'emergency'] });
});

router.get('/risk-levels', (_req: Request, res: Response) => {
  res.json({ riskLevels });
});

export default router;
