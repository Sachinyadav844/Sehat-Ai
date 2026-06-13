import { Server, Socket } from 'socket.io';
import { initConsultationSocket } from '../realtime/consultationSocket.js';
import { TruGenRealtimeService } from '../video/trugen.service.js';
import { config } from '../config/index.js';

export function initSocket(io: Server) {
  initConsultationSocket(io);

  const trugenService = new TruGenRealtimeService(
    config.trugen.apiKey,
    config.trugen.baseUrl,
    config.trugen.region || undefined
  );

  const activeStreams = new Map<string, { sessionId: string; stop: () => Promise<void> }>();

  io.on('connection', (socket: Socket) => {
    socket.on('start_video', async (payload) => {
      try {
        const { consultationId, avatarId, language = 'en', quality = 'high' } = payload || {};
        if (!consultationId) {
          socket.emit('video:error', { message: 'consultationId is required' });
          return;
        }

        const session = await trugenService.startAvatarStream(consultationId, {
          avatarId: avatarId || config.trugen.avatarId,
          agentId: config.trugen.agentId,
          language,
          quality,
        });

        activeStreams.set(socket.id, { sessionId: session.sessionId, stop: session.stop });

        socket.emit('video:started', { sessionId: session.sessionId, streamUrl: session.streamUrl });
        socket.emit('video_stream', { sessionId: session.sessionId, streamUrl: session.streamUrl });
        console.log(`[SOCKET] Video stream started for ${consultationId} (socket ${socket.id})`, session.streamUrl);
      } catch (error) {
        console.error('[SOCKET] start_video error:', error);
        socket.emit('video:error', { message: error instanceof Error ? error.message : 'Failed to start video stream' });
      }
    });

    socket.on('stop_video', async () => {
      try {
        const controller = activeStreams.get(socket.id);
        if (controller) {
          await controller.stop();
          activeStreams.delete(socket.id);
          socket.emit('video:stopped', { sessionId: controller.sessionId });
          console.log(`[SOCKET] Video stream stopped for socket ${socket.id}`);
        }
      } catch (error) {
        console.error('[SOCKET] stop_video error:', error);
        socket.emit('video:error', { message: error instanceof Error ? error.message : 'Failed to stop video stream' });
      }
    });

    socket.on('disconnect', async () => {
      const controller = activeStreams.get(socket.id);
      if (controller) {
        await controller.stop();
        activeStreams.delete(socket.id);
      }
    });
  });

  console.log('[SOCKET] Socket.IO initialized');
}
