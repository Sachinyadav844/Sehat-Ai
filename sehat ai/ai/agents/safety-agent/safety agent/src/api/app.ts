import express, {NextFunction, Request, Response} from 'express';
import pinoHttp from 'pino-http';
import {SafetyService} from '../core/safety.service';
import {logError, logInfo} from '../utils/logger';
import {clinicalSafetyRules} from '../rules/safety.rules';
import emergencySymptoms from '../../datasets/emergency-symptoms/index.json';

const app = express();
const safetyService = new SafetyService();

app.use(express.json({limit: '12kb'}));
app.use(pinoHttp());

app.get('/health', (_req: Request, res: Response) => {
  logInfo('Health check requested');
  res.json({service: 'safety-agent', status: 'healthy'});
});

app.get('/rules', (_req: Request, res: Response) => {
  logInfo('Rules requested');
  res.json({clinicalSafetyRules});
});

app.get('/emergency-rules', (_req: Request, res: Response) => {
  logInfo('Emergency rules requested');
  res.json({emergencySymptoms});
});

app.post('/safety/evaluate', async (req: Request, res: Response, next: NextFunction) => {
  logInfo('Safety Check Started', {sessionId: req.body?.sessionId});

  try {
    const result = await safetyService.evaluateSafety(req.body);
    logInfo('Response Generated', {sessionId: req.body?.sessionId, safe: result.safe, escalationLevel: result.escalationLevel});
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logError('Errors', {error: err instanceof Error ? err.message : String(err)});
  res.status(500).json({error: 'Internal safety agent error'});
});

export default app;
