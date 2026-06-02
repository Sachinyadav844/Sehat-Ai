import { Router } from 'express';
import { sendTranscript } from '../integrations/ai-gateway/aiGateway.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const aiGatewayRouter = Router();

aiGatewayRouter.post('/transcript', requireAuth, sendTranscript);
