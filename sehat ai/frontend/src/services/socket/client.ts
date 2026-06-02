import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export const socketService = {
  connect(consultationId: string) {
    if (socket && socket.connected) {
      return socket;
    }

    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[SOCKET] Connected:', socket?.id);
      // Emit consultation start
      socket?.emit('consultation:start', {
        consultationId,
        userId: localStorage.getItem('userId'),
        language: localStorage.getItem('language') || 'en',
      });
    });

    socket.on('disconnect', () => {
      console.log('[SOCKET] Disconnected');
    });

    socket.on('error', (error) => {
      console.error('[SOCKET] Error:', error);
    });

    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket() {
    return socket;
  },

  // Consultation Events
  onConsultationStarted(callback: (data: any) => void) {
    if (socket) {
      socket.on('consultation:started', callback);
    }
  },

  onConsultationEnded(callback: (data: any) => void) {
    if (socket) {
      socket.on('consultation:ended', callback);
    }
  },

  // Audio Events
  emitAudioChunk(consultationId: string, chunk: Buffer) {
    if (socket) {
      socket.emit('audio:stream', {
        consultationId,
        chunk: chunk.toString('base64'),
      });
    }
  },

  onAudioReceived(callback: (data: any) => void) {
    if (socket) {
      socket.on('audio:received', callback);
    }
  },

  flushAudio(consultationId: string) {
    if (socket) {
      socket.emit('audio:flush', { consultationId });
    }
  },

  // AI Processing Events
  onAIProcessing(callback: (data: any) => void) {
    if (socket) {
      socket.on('ai:processing', callback);
    }
  },

  onAIResponse(callback: (data: any) => void) {
    if (socket) {
      socket.on('ai:response', callback);
    }
  },

  onAIError(callback: (data: any) => void) {
    if (socket) {
      socket.on('ai:error', callback);
    }
  },

  // Transcription Events
  onTranscript(callback: (data: any) => void) {
    if (socket) {
      socket.on('consultation:transcript', callback);
    }
  },

  // WebRTC Events
  emitWebRTCOffer(consultationId: string, offer: RTCSessionDescriptionInit) {
    if (socket) {
      socket.emit('webrtc:offer', { consultationId, offer });
    }
  },

  onWebRTCOffer(callback: (data: any) => void) {
    if (socket) {
      socket.on('webrtc:offer', callback);
    }
  },

  emitWebRTCAnswer(consultationId: string, answer: RTCSessionDescriptionInit, toSocketId: string) {
    if (socket) {
      socket.emit('webrtc:answer', { consultationId, answer, toSocketId });
    }
  },

  onWebRTCAnswer(callback: (data: any) => void) {
    if (socket) {
      socket.on('webrtc:answer', callback);
    }
  },

  emitICECandidate(consultationId: string, candidate: RTCIceCandidate) {
    if (socket) {
      socket.emit('webrtc:ice-candidate', {
        consultationId,
        candidate: {
          candidate: candidate.candidate,
          sdpMLineIndex: candidate.sdpMLineIndex,
          sdpMid: candidate.sdpMid,
        },
      });
    }
  },

  onICECandidate(callback: (data: any) => void) {
    if (socket) {
      socket.on('webrtc:ice-candidate', callback);
    }
  },

  emitWebRTCConnected(consultationId: string) {
    if (socket) {
      socket.emit('webrtc:connected', { consultationId });
    }
  },

  onWebRTCConnectionStatus(callback: (data: any) => void) {
    if (socket) {
      socket.on('webrtc:connection-status', callback);
    }
  },

  // Avatar Events
  emitAvatarInit(consultationId: string, avatarId: string) {
    if (socket) {
      socket.emit('avatar:init', { consultationId, avatarId });
    }
  },

  onAvatarInitialized(callback: (data: any) => void) {
    if (socket) {
      socket.on('avatar:initialized', callback);
    }
  },

  emitAvatarSpeak(consultationId: string, text: string, emotion: string = 'neutral') {
    if (socket) {
      socket.emit('avatar:speak', { consultationId, text, emotion });
    }
  },

  onAvatarSpeaking(callback: (data: any) => void) {
    if (socket) {
      socket.on('avatar:speaking', callback);
    }
  },

  onAvatarError(callback: (data: any) => void) {
    if (socket) {
      socket.on('avatar:error', callback);
    }
  },

  // Dashboard Events
  joinDashboard(userId: string) {
    if (socket) {
      socket.emit('dashboard:join', { userId });
    }
  },

  onDashboardUpdate(callback: (data: any) => void) {
    if (socket) {
      socket.on('dashboard:update', callback);
    }
  },

  onConsultationDashboardUpdate(callback: (data: any) => void) {
    if (socket) {
      socket.on('consultation:dashboard-update', callback);
    }
  },

  // Emergency Events
  onEmergencyEscalation(callback: (data: any) => void) {
    if (socket) {
      socket.on('emergency:escalation', callback);
    }
  },

  // Remove all listeners
  removeAllListeners() {
    if (socket) {
      socket.removeAllListeners();
    }
  },
};
