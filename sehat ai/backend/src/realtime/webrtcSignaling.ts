import { Server, Socket } from 'socket.io';

export interface WebRTCOffer {
  type: 'offer';
  sdp: string;
}

export interface WebRTCAnswer {
  type: 'answer';
  sdp: string;
}

export interface ICECandidate {
  candidate: string;
  sdpMLineIndex: number;
  sdpMid: string;
}

export interface VideoStreamConfig {
  consultationId: string;
  userId: string;
  audio: boolean;
  video: boolean;
  resolution?: '360p' | '480p' | '720p';
  bandwidth?: number;
}

export interface PeerConnection {
  consultationId: string;
  socketId: string;
  offer?: WebRTCOffer;
  answer?: WebRTCAnswer;
  iceCandidates: ICECandidate[];
  status: 'initiating' | 'connecting' | 'connected' | 'failed' | 'closed';
}

export class WebRTCSignalingManager {
  private peers: Map<string, PeerConnection> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  createPeerConnection(consultationId: string, socketId: string): PeerConnection {
    const peerId = `${consultationId}-${socketId}`;
    const peer: PeerConnection = {
      consultationId,
      socketId,
      iceCandidates: [],
      status: 'initiating',
    };
    this.peers.set(peerId, peer);
    return peer;
  }

  setPeerOffer(consultationId: string, socketId: string, offer: WebRTCOffer) {
    const peerId = `${consultationId}-${socketId}`;
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.offer = offer;
      peer.status = 'connecting';
    }
  }

  setPeerAnswer(consultationId: string, socketId: string, answer: WebRTCAnswer) {
    const peerId = `${consultationId}-${socketId}`;
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.answer = answer;
      peer.status = 'connected';
    }
  }

  addICECandidate(consultationId: string, socketId: string, candidate: ICECandidate) {
    const peerId = `${consultationId}-${socketId}`;
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.iceCandidates.push(candidate);
    }
  }

  getPeerConnection(consultationId: string, socketId: string): PeerConnection | undefined {
    const peerId = `${consultationId}-${socketId}`;
    return this.peers.get(peerId);
  }

  closePeerConnection(consultationId: string, socketId: string) {
    const peerId = `${consultationId}-${socketId}`;
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.status = 'closed';
      this.peers.delete(peerId);
    }
  }

  broadcastOffer(consultationId: string, offer: WebRTCOffer, fromSocketId: string) {
    this.io.to(consultationId).emit('webrtc:offer', { offer, fromSocketId });
  }

  broadcastAnswer(consultationId: string, answer: WebRTCAnswer, toSocketId: string) {
    this.io.to(toSocketId).emit('webrtc:answer', { answer });
  }

  broadcastICECandidate(consultationId: string, candidate: ICECandidate, fromSocketId: string) {
    this.io.to(consultationId).emit('webrtc:ice-candidate', { candidate, fromSocketId });
  }

  broadcastConnectionStatus(consultationId: string, status: string) {
    this.io.to(consultationId).emit('webrtc:connection-status', { status });
  }
}
