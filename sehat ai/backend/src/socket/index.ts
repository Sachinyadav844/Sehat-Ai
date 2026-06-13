import { Server } from 'socket.io';
import { initConsultationSocket } from '../realtime/consultationSocket.js';

export function initSocket(io: Server) {
  // Initialize consultation socket handlers
  initConsultationSocket(io);

  console.log('[SOCKET] Socket.IO initialized');
}
