import { Router } from 'express';
import { ragSearch, ragContext, ragEmergency, ragMultilingual } from '../controllers/ragController.js';
import { requireAuth } from '../middleware/auth.js';

export const ragRouter = Router();

ragRouter.post('/search', requireAuth, ragSearch);
ragRouter.post('/context', requireAuth, ragContext);
ragRouter.post('/emergency', requireAuth, ragEmergency);
ragRouter.post('/multilingual', requireAuth, ragMultilingual);
