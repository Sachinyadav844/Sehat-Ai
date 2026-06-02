import { Router } from 'express';
import {
  initializeVideoSession,
  startVideoStream,
  joinVideoSession,
  leaveVideoSession,
  reconnectVideoSession,
  endVideoSession,
  getVideoSessionStatus,
  listSessionParticipants,
  avatarSpeak,
  listAvailableAvatars,
  pauseVideoSession,
  resumeVideoSession,
  sendVideoTranscript,
  avatarRespond,
} from '../controllers/videoController.js';
import { requireAuth } from '../middleware/auth.js';

export const videoRouter = Router();

// Video Session Management
videoRouter.post('/session/init', requireAuth, initializeVideoSession);
videoRouter.post('/session/start', requireAuth, startVideoStream);
videoRouter.post('/session/join', requireAuth, joinVideoSession);
videoRouter.post('/session/leave', requireAuth, leaveVideoSession);
videoRouter.post('/session/reconnect', requireAuth, reconnectVideoSession);
videoRouter.post('/session/end', requireAuth, endVideoSession);
videoRouter.get('/session/:sessionId/status', requireAuth, getVideoSessionStatus);
videoRouter.get('/session/:sessionId/participants', requireAuth, listSessionParticipants);
videoRouter.post('/session/pause', requireAuth, pauseVideoSession);
videoRouter.post('/session/resume', requireAuth, resumeVideoSession);
videoRouter.post('/transcript', requireAuth, sendVideoTranscript);

// Avatar Control
videoRouter.post('/avatar/speak', requireAuth, avatarSpeak);
videoRouter.post('/avatar/respond', requireAuth, avatarRespond);
videoRouter.get('/avatars', requireAuth, listAvailableAvatars);
