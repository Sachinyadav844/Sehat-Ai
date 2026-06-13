import { Server } from 'socket.io';
import { WebRTCSignalingManager, WebRTCOffer, WebRTCAnswer, ICECandidate } from '../../realtime/webrtcSignaling.js';

export class WebRTCService {
  private manager: WebRTCSignalingManager;

  constructor(private io: Server) {
    this.manager = new WebRTCSignalingManager(io);
  }

  handleOffer(consultationId: string, socketId: string, offer: WebRTCOffer) {
    this.manager.setPeerOffer(consultationId, socketId, offer);
    this.manager.broadcastOffer(consultationId, offer, socketId);
  }

  handleAnswer(consultationId: string, socketId: string, answer: WebRTCAnswer, toSocketId: string) {
    this.manager.setPeerAnswer(consultationId, socketId, answer);
    this.manager.broadcastAnswer(consultationId, answer, toSocketId);
  }

  handleIceCandidate(consultationId: string, socketId: string, candidate: ICECandidate) {
    this.manager.addICECandidate(consultationId, socketId, candidate);
    this.manager.broadcastICECandidate(consultationId, candidate, socketId);
  }

  notifyConnectionStatus(consultationId: string, status: string) {
    this.manager.broadcastConnectionStatus(consultationId, status);
  }
}
