import { Request, Response } from 'express';
import { prisma } from '../database/client.js';
import { TruGenService } from '../services/trugenService.js';
import { AIGatewayService } from '../integrations/ai-gateway/aiGateway.service.js';
import { config } from '../config/index.js';
import { v4 as uuidv4 } from 'uuid';
import { VideoSessionManager } from '../video/session-manager/sessionManager.js';

const trugenService = new TruGenService(config.trugen.apiKey, config.trugen.baseUrl, config.trugen.region);
const aiGatewayService = new AIGatewayService();
const videoSessionManager = new VideoSessionManager();

export async function initializeVideoSession(req: Request, res: Response) {
  try {
    const userId = (req as any).user.sub;
    const { consultationId, avatarId } = req.body;
    const effectiveAvatarId = avatarId || config.trugen.avatarId;

    if (!consultationId || !effectiveAvatarId) {
      return res.status(400).json({
        ok: false,
        message: 'Missing consultationId or avatarId',
      });
    }

    // Verify consultation belongs to user
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation || consultation.userId !== userId) {
      return res.status(403).json({
        ok: false,
        message: 'Unauthorized',
      });
    }

    // Create TruGen session using the configured agent and avatar
    const trugenSession = await trugenService.createSession(consultationId, {
      agentId: config.trugen.agentId,
      avatarId: effectiveAvatarId,
      language: consultation.language || 'en',
      quality: 'high',
    });

    res.json({
      ok: true,
      sessionId: trugenSession.id,
      streamUrl: trugenSession.streamUrl,
      consultationId,
    });
  } catch (error) {
    console.error('Initialize video session error:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to initialize video session',
      error: (error as Error).message,
    });
  }
}

export async function startVideoStream(req: Request, res: Response) {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        ok: false,
        message: 'Missing sessionId',
      });
    }

    await trugenService.startStreaming(sessionId);

    const session = await videoSessionManager.getSessionByTruGenSessionId(sessionId);
    if (session) {
      await videoSessionManager.updateSession(session.consultationId, { status: 'streaming' });
    }

    res.json({
      ok: true,
      message: 'Video stream started',
      sessionId,
    });
  } catch (error) {
    console.error('Start video stream error:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to start video stream',
      error: (error as Error).message,
    });
  }
}

export async function joinVideoSession(req: Request, res: Response) {
  try {
    const userId = (req as any).user.sub;
    const { consultationId, socketId } = req.body;

    if (!consultationId || !socketId) {
      return res.status(400).json({ ok: false, message: 'Missing consultationId or socketId' });
    }

    const participants = await videoSessionManager.joinSession(consultationId, socketId);
    res.json({ ok: true, consultationId, participants });
  } catch (error) {
    console.error('Join video session error:', error);
    res.status(500).json({ ok: false, message: 'Failed to join video session', error: (error as Error).message });
  }
}

export async function leaveVideoSession(req: Request, res: Response) {
  try {
    const { consultationId, socketId } = req.body;

    if (!consultationId || !socketId) {
      return res.status(400).json({ ok: false, message: 'Missing consultationId or socketId' });
    }

    const participants = await videoSessionManager.leaveSession(consultationId, socketId);
    res.json({ ok: true, consultationId, participants });
  } catch (error) {
    console.error('Leave video session error:', error);
    res.status(500).json({ ok: false, message: 'Failed to leave video session', error: (error as Error).message });
  }
}

export async function reconnectVideoSession(req: Request, res: Response) {
  try {
    const { consultationId, socketId } = req.body;

    if (!consultationId || !socketId) {
      return res.status(400).json({ ok: false, message: 'Missing consultationId or socketId' });
    }

    const participants = await videoSessionManager.reconnectSession(consultationId, socketId);
    res.json({ ok: true, consultationId, participants });
  } catch (error) {
    console.error('Reconnect video session error:', error);
    res.status(500).json({ ok: false, message: 'Failed to reconnect video session', error: (error as Error).message });
  }
}

export async function endVideoSession(req: Request, res: Response) {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        ok: false,
        message: 'Missing sessionId',
      });
    }

    const session = await videoSessionManager.getSessionByTruGenSessionId(sessionId);
    if (session) {
      await videoSessionManager.endSession(session.consultationId);
    }

    await trugenService.endSession(sessionId);

    res.json({
      ok: true,
      message: 'Video session ended',
      sessionId,
    });
  } catch (error) {
    console.error('End video session error:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to end video session',
      error: (error as Error).message,
    });
  }
}

export async function getVideoSessionStatus(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        ok: false,
        message: 'Missing sessionId',
      });
    }

    const session = await trugenService.getSessionStatus(sessionId);

    if (!session) {
      return res.status(404).json({
        ok: false,
        message: 'Session not found',
      });
    }

    res.json({
      ok: true,
      session,
    });
  } catch (error) {
    console.error('Get video session status error:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to get session status',
      error: (error as Error).message,
    });
  }
}

export async function listSessionParticipants(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ ok: false, message: 'Missing sessionId' });
    }

    const session = await videoSessionManager.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ ok: false, message: 'Session not found' });
    }

    res.json({ ok: true, participants: session.participants });
  } catch (error) {
    console.error('List session participants error:', error);
    res.status(500).json({ ok: false, message: 'Failed to list session participants', error: (error as Error).message });
  }
}

export async function avatarSpeak(req: Request, res: Response) {
  try {
    const { sessionId, text, language, emotion = 'neutral' } = req.body;

    if (!sessionId || !text) {
      return res.status(400).json({
        ok: false,
        message: 'Missing sessionId or text',
      });
    }

    const response = await trugenService.generateSpeechWithEmotion(
      sessionId,
      text,
      language || 'en',
      emotion
    );

    res.json({
      ok: true,
      response,
    });
  } catch (error) {
    console.error('Avatar speak error:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to generate avatar speech',
      error: (error as Error).message,
    });
  }
}

export async function listAvailableAvatars(req: Request, res: Response) {
  try {
    const avatars = await trugenService.listAvailableAvatars();

    res.json({
      ok: true,
      avatars,
    });
  } catch (error) {
    console.error('List avatars error:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to list avatars',
      error: (error as Error).message,
    });
  }
}

export async function sendVideoTranscript(req: Request, res: Response) {
  try {
    const userId = (req as any).user.sub;
    const { consultationId, transcript, language, history } = req.body;

    if (!consultationId || !transcript) {
      return res.status(400).json({ ok: false, message: 'Missing consultationId or transcript' });
    }

    const consultation = await prisma.consultation.findUnique({ where: { id: consultationId } });
    if (!consultation || consultation.userId !== userId) {
      return res.status(403).json({ ok: false, message: 'Unauthorized' });
    }

    await prisma.transcript.create({
      data: {
        consultationId,
        speaker: 'patient',
        text: transcript,
        language: language || consultation.language || 'en',
      },
    });

    const validatedResponse = await aiGatewayService.sendTranscript(
      consultationId,
      transcript,
      language || consultation.language || 'en',
      history || []
    );

    res.json({ ok: true, validatedResponse });
  } catch (error) {
    console.error('Video transcript error:', error);
    res.status(500).json({ ok: false, message: 'Failed to process transcript', error: (error as Error).message });
  }
}

export async function avatarRespond(req: Request, res: Response) {
  try {
    const { sessionId, text, language = 'en', emotion = 'neutral' } = req.body;

    if (!sessionId || !text) {
      return res.status(400).json({ ok: false, message: 'Missing sessionId or text' });
    }

    const response = await trugenService.generateSpeechWithEmotion(sessionId, text, language, emotion);

    res.json({ ok: true, response });
  } catch (error) {
    console.error('Avatar respond error:', error);
    res.status(500).json({ ok: false, message: 'Failed to respond via avatar', error: (error as Error).message });
  }
}

export async function pauseVideoSession(req: Request, res: Response) {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        ok: false,
        message: 'Missing sessionId',
      });
    }

    await trugenService.pauseSession(sessionId);

    res.json({
      ok: true,
      message: 'Session paused',
      sessionId,
    });
  } catch (error) {
    console.error('Pause session error:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to pause session',
      error: (error as Error).message,
    });
  }
}

export async function resumeVideoSession(req: Request, res: Response) {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        ok: false,
        message: 'Missing sessionId',
      });
    }

    await trugenService.resumeSession(sessionId);

    res.json({
      ok: true,
      message: 'Session resumed',
      sessionId,
    });
  } catch (error) {
    console.error('Resume session error:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to resume session',
      error: (error as Error).message,
    });
  }
}
