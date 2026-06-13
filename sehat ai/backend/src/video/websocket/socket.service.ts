import { Server, Socket } from 'socket.io';

export class SocketService {
  constructor(private io: Server) {}

  emit(room: string, event: string, payload: any) {
    this.io.to(room).emit(event, payload);
  }

  emitToSocket(socket: Socket, event: string, payload: any) {
    socket.emit(event, payload);
  }

  broadcast(event: string, payload: any) {
    this.io.emit(event, payload);
  }
}
