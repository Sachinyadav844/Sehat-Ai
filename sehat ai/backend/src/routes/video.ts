import { Router } from 'express';
import {
  initializeVideoSession,
  startVideoStream,
  endVideoSession,
  getVideoSessionStatus,
  avatarSpeak,
  listAvailableAvatars,
  pauseVideoSession,
  resumeVideoSession,
} from '../controllers/videoController.js';
import { requireAuth } from '../middleware/auth.js';

export const videoRouter = Router();

// Video Session Management
videoRouter.post('/session/init', requireAuth, initializeVideoSession);
videoRouter.post('/session/start', requireAuth, startVideoStream);
videoRouter.post('/session/end', requireAuth, endVideoSession);
videoRouter.get('/session/:sessionId/status', requireAuth, getVideoSessionStatus);
videoRouter.post('/session/pause', requireAuth, pauseVideoSession);
videoRouter.post('/session/resume', requireAuth, resumeVideoSession);

// Avatar Control
videoRouter.post('/avatar/speak', requireAuth, avatarSpeak);
videoRouter.get('/avatars', requireAuth, listAvailableAvatars);
