import { Router } from 'express';
import { createTrugenSession, streamAudio, avatarSpeak } from '../controllers/trugenController.js';
import { requireAuth } from '../middleware/auth.js';

export const trugenRouter = Router();

trugenRouter.post('/session', requireAuth, createTrugenSession);
trugenRouter.post('/stream', requireAuth, streamAudio);
trugenRouter.post('/speak', requireAuth, avatarSpeak);
