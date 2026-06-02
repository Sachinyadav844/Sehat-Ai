import { Server, Socket } from 'socket.io';
import { prisma } from '../database/client.js';
import { AudioStreamProcessor, SpeechToTextService, TextToSpeechService } from '../services/mediaService.js';
import { TruGenService } from '../services/trugenService.js';
import { AIOrchestratorService } from '../services/aiOrchestratorService.js';
import { WebRTCSignalingManager } from '../realtime/webrtcSignaling.js';
import { ConversationContext, Transcript } from '../types/consultation.js';
import { config } from '../config/index.js';
import { createRedisPublisher } from '../database/redisClient.js';

interface ConsultationSession {
  consultationId: string;
  userId: string;
  socketId: string;
  language: string;
  status: 'active' | 'paused' | 'ended';
  audioProcessor: AudioStreamProcessor;
  transcripts: Transcript[];
  isProcessing: boolean;
  avatarSessionId?: string;
}

const activeSessions = new Map<string, ConsultationSession>();

export function initConsultationSocket(io: Server) {
  const sttService = new SpeechToTextService(config.openaiKey);
  const ttsService = new TextToSpeechService(config.openaiKey);
  const trugenService = new TruGenService(config.trugen.apiKey, config.trugen.baseUrl);
  const orchestrator = new AIOrchestratorService('http://localhost:8000');
  const redisPublisher = createRedisPublisher();
  const webrtcManager = new WebRTCSignalingManager(io);

  io.on('connection', (socket: Socket) => {
    console.log('[SOCKET] Client connected:', socket.id);

    // ======================
    // CONSULTATION LIFECYCLE
    // ======================

    socket.on('consultation:start', async (payload) => {
      try {
        const { consultationId, userId, language = 'en' } = payload;

        // Validate consultation exists
        const consultation = await prisma.consultation.findUnique({
          where: { id: consultationId },
        });

        if (!consultation) {
          socket.emit('consultation:error', { message: 'Consultation not found' });
          return;
        }

        // Create session
        const session: ConsultationSession = {
          consultationId,
          userId,
          socketId: socket.id,
          language,
          status: 'active',
          audioProcessor: new AudioStreamProcessor(),
          transcripts: [],
          isProcessing: false,
        };

        activeSessions.set(consultationId, session);
        socket.join(consultationId);

        // Update consultation status
        await prisma.consultation.update({
          where: { id: consultationId },
          data: { status: 'started', startedAt: new Date() },
        });

        // Emit confirmation
        io.to(consultationId).emit('consultation:started', {
          consultationId,
          status: 'active',
          language,
          timestamp: new Date(),
        });
        await redisPublisher.publish('sehat:consultation:events', JSON.stringify({ consultationId, event: 'consultation_started', language, status: 'active', timestamp: new Date().toISOString() }));

        console.log(`[SOCKET] Consultation started: ${consultationId}`);
      } catch (error) {
        console.error('[SOCKET] Consultation start error:', error);
        socket.emit('consultation:error', { message: 'Failed to start consultation' });
      }
    });

    socket.on('consultation:stop', async (payload) => {
      try {
        const { consultationId } = payload;
        const session = activeSessions.get(consultationId);

        if (!session) {
          socket.emit('consultation:error', { message: 'Session not found' });
          return;
        }

        session.status = 'ended';

        // End avatar session if exists
        if (session.avatarSessionId) {
          await trugenService.endSession(session.avatarSessionId);
        }

        // Update consultation
        await prisma.consultation.update({
          where: { id: consultationId },
          data: { status: 'ended', endedAt: new Date() },
        });

        // Emit confirmation
        io.to(consultationId).emit('consultation:ended', {
          consultationId,
          timestamp: new Date(),
        });
        await redisPublisher.publish('sehat:consultation:events', JSON.stringify({ consultationId, event: 'consultation_ended', timestamp: new Date().toISOString() }));

        activeSessions.delete(consultationId);
        socket.leave(consultationId);

        console.log(`[SOCKET] Consultation ended: ${consultationId}`);
      } catch (error) {
        console.error('[SOCKET] Consultation stop error:', error);
        socket.emit('consultation:error', { message: 'Failed to stop consultation' });
      }
    });

    // ======================
    // AUDIO STREAMING
    // ======================

    socket.on('audio:stream', async (payload) => {
      try {
        const { consultationId, chunk } = payload;
        const session = activeSessions.get(consultationId);

        if (!session || session.status !== 'active') {
          socket.emit('audio:error', { message: 'Session not active' });
          return;
        }

        // Add audio chunk to buffer
        const buffer = Buffer.from(chunk, 'base64');
        session.audioProcessor.addChunk(buffer);

        // Emit acknowledgment
        socket.emit('audio:received', { size: buffer.length });

        // Process audio every N chunks or after buffer size threshold
        if (session.audioProcessor.getChunkCount() >= 5 || session.audioProcessor.getBufferSize() > 16000) {
          await processAudioBuffer(session, consultationId, io, sttService, orchestrator);
        }
      } catch (error) {
        console.error('[SOCKET] Audio stream error:', error);
        socket.emit('audio:error', { message: 'Failed to process audio' });
      }
    });

    socket.on('audio:flush', async (payload) => {
      try {
        const { consultationId } = payload;
        const session = activeSessions.get(consultationId);

        if (!session) return;

        // Process remaining audio in buffer
        if (session.audioProcessor.getBufferSize() > 0) {
          await processAudioBuffer(session, consultationId, io, sttService, orchestrator);
        }

        socket.emit('audio:flushed', { consultationId });
      } catch (error) {
        console.error('[SOCKET] Audio flush error:', error);
      }
    });

    // ======================
    // WEBRTC SIGNALING
    // ======================

    socket.on('webrtc:offer', async (payload) => {
      try {
        const { consultationId, offer } = payload;
        webrtcManager.setPeerOffer(consultationId, socket.id, offer);
        io.to(consultationId).emit('webrtc:offer', { offer, fromSocketId: socket.id });
        console.log(`[SOCKET] WebRTC offer from ${socket.id}`);
      } catch (error) {
        console.error('[SOCKET] WebRTC offer error:', error);
      }
    });

    socket.on('webrtc:answer', async (payload) => {
      try {
        const { consultationId, answer, toSocketId } = payload;
        webrtcManager.setPeerAnswer(consultationId, socket.id, answer);
        io.to(toSocketId).emit('webrtc:answer', { answer, fromSocketId: socket.id });
        console.log(`[SOCKET] WebRTC answer from ${socket.id}`);
      } catch (error) {
        console.error('[SOCKET] WebRTC answer error:', error);
      }
    });

    socket.on('webrtc:ice-candidate', async (payload) => {
      try {
        const { consultationId, candidate } = payload;
        webrtcManager.addICECandidate(consultationId, socket.id, candidate);
        io.to(consultationId).emit('webrtc:ice-candidate', { candidate, fromSocketId: socket.id });
      } catch (error) {
        console.error('[SOCKET] ICE candidate error:', error);
      }
    });

    socket.on('webrtc:connected', async (payload) => {
      try {
        const { consultationId } = payload;
        webrtcManager.broadcastConnectionStatus(consultationId, 'connected');
        io.to(consultationId).emit('webrtc:connection-status', { status: 'connected' });
      } catch (error) {
        console.error('[SOCKET] WebRTC connected error:', error);
      }
    });

    // ======================
    // AVATAR MANAGEMENT
    // ======================

    socket.on('avatar:init', async (payload) => {
      try {
        const { consultationId, avatarId } = payload;
        const session = activeSessions.get(consultationId);

        if (!session) {
          socket.emit('avatar:error', { message: 'Session not found' });
          return;
        }

        // Create TruGen session
        const trugenSession = await trugenService.createSession(consultationId, {
          avatarId,
          language: session.language,
          quality: 'high',
        });

        session.avatarSessionId = trugenSession.id;

        // Start streaming
        await trugenService.startStreaming(trugenSession.id);

        // Emit success
        io.to(consultationId).emit('avatar:initialized', {
          sessionId: trugenSession.id,
          streamUrl: trugenSession.streamUrl,
        });

        console.log(`[SOCKET] Avatar initialized for consultation: ${consultationId}`);
      } catch (error) {
        console.error('[SOCKET] Avatar init error:', error);
        socket.emit('avatar:error', { message: 'Failed to initialize avatar' });
      }
    });

    socket.on('avatar:speak', async (payload) => {
      try {
        const { consultationId, text, emotion = 'neutral' } = payload;
        const session = activeSessions.get(consultationId);

        if (!session || !session.avatarSessionId) {
          socket.emit('avatar:error', { message: 'Avatar session not active' });
          return;
        }

        // Generate speech with avatar
        const response = await trugenService.generateSpeechWithEmotion(
          session.avatarSessionId,
          text,
          session.language,
          emotion
        );

        // Broadcast to room
        io.to(consultationId).emit('avatar:speaking', {
          videoUrl: response.videoUrl,
          audioUrl: response.audioUrl,
          duration: response.duration,
        });

        // Save transcript
        await prisma.transcript.create({
          data: {
            consultationId,
            speaker: 'ai',
            text,
            language: session.language,
          },
        });

        console.log(`[SOCKET] Avatar speaking: ${consultationId}`);
      } catch (error) {
        console.error('[SOCKET] Avatar speak error:', error);
        socket.emit('avatar:error', { message: 'Failed to generate speech' });
      }
    });

    // ======================
    // DASHBOARD EVENTS
    // ======================

    socket.on('dashboard:join', (payload) => {
      try {
        const { userId } = payload;
        const dashboardRoom = `dashboard:${userId}`;
        socket.join(dashboardRoom);
        socket.emit('dashboard:joined', { room: dashboardRoom });
      } catch (error) {
        console.error('[SOCKET] Dashboard join error:', error);
      }
    });

    // ======================
    // DISCONNECT
    // ======================

    socket.on('disconnect', () => {
      console.log('[SOCKET] Client disconnected:', socket.id);
      // Cleanup any active sessions for this socket
      activeSessions.forEach((session, consultationId) => {
        if (session.socketId === socket.id) {
          activeSessions.delete(consultationId);
        }
      });
    });
  });
}

async function processAudioBuffer(
  session: ConsultationSession,
  consultationId: string,
  io: Server,
  sttService: SpeechToTextService,
  orchestrator: AIOrchestratorService
) {
  if (session.isProcessing) return;

  session.isProcessing = true;

  try {
    // Get buffer
    const audioBuffer = session.audioProcessor.getBuffer();
    if (audioBuffer.length === 0) {
      session.isProcessing = false;
      return;
    }

    // Emit processing status
    io.to(consultationId).emit('ai:processing', { status: 'transcribing' });

    // Transcribe audio
    const sttResult = await sttService.transcribeStream(audioBuffer, session.language);

    // Save transcript
    const transcript = await prisma.transcript.create({
      data: {
        consultationId,
        speaker: 'patient',
        text: sttResult.text,
        language: sttResult.language,
      },
    });

    session.transcripts.push({
      id: transcript.id,
      speaker: 'patient',
      text: sttResult.text,
      language: sttResult.language,
      timestamp: new Date(),
    });

    // Emit transcription
    io.to(consultationId).emit('consultation:transcript', {
      speaker: 'patient',
      text: sttResult.text,
      language: sttResult.language,
    });
    await redisPublisher.publish('sehat:consultation:events', JSON.stringify({ consultationId, event: 'transcript', speaker: 'patient', text: sttResult.text, language: sttResult.language, timestamp: new Date().toISOString() }));

    // Process with AI orchestrator
    io.to(consultationId).emit('ai:processing', { status: 'analyzing' });

    const context: ConversationContext = {
      consultationId,
      language: session.language,
      symptoms: [],
      riskLevel: 'unknown',
      history: session.transcripts,
      metadata: {},
    };

    const orchestrationResult = await orchestrator.orchestrateConsultation(context);

    // Save symptoms and risk assessment
    for (const symptom of orchestrationResult.symptoms) {
      await prisma.symptom.create({
        data: {
          consultationId,
          name: symptom.name,
          duration: symptom.duration,
          severity: symptom.severity,
        },
      });
    }

    if (orchestrationResult.riskAssessment) {
      await prisma.riskAssessment.create({
        data: {
          consultationId,
          riskScore: orchestrationResult.riskAssessment.riskScore,
          level: orchestrationResult.riskAssessment.level,
          confidence: orchestrationResult.riskAssessment.confidence,
          details: orchestrationResult.riskAssessment.details,
        },
      });
    }

    // Check for emergency
    if (orchestrationResult.shouldEscalate) {
      io.to(consultationId).emit('emergency:escalation', {
        message: orchestrationResult.emergencyMessage,
        type: 'safety',
      });

      await redisPublisher.publish('sehat:consultation:events', JSON.stringify({ consultationId, event: 'emergency_escalation', message: orchestrationResult.emergencyMessage, type: 'safety', timestamp: new Date().toISOString() }));

      await prisma.emergencyEvent.create({
        data: {
          consultationId,
          type: 'safety',
          message: orchestrationResult.emergencyMessage || 'Emergency escalation triggered',
        },
      });
    }

    // Emit AI response
    io.to(consultationId).emit('ai:response', {
      symptoms: orchestrationResult.symptoms,
      riskLevel: orchestrationResult.riskAssessment.level,
      recommendations: orchestrationResult.recommendations,
      nextAction: orchestrationResult.nextAction,
    });
    await redisPublisher.publish('sehat:consultation:events', JSON.stringify({ consultationId, event: 'ai_response', symptoms: orchestrationResult.symptoms, riskLevel: orchestrationResult.riskAssessment.level, nextAction: orchestrationResult.nextAction, timestamp: new Date().toISOString() }));

    io.to(consultationId).emit('ai:processing', { status: 'complete' });

    // Clear buffer
    session.audioProcessor.clearBuffer();
  } catch (error) {
    console.error('[AUDIO_PROCESS] Error:', error);
    io.to(consultationId).emit('ai:error', { message: 'Failed to process audio' });
  } finally {
    session.isProcessing = false;
  }
}

export { activeSessions };
