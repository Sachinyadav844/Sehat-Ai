import { Server } from 'socket.io';

export class AvatarEventsService {
  constructor(private io: Server) {}

  emitAvatarEvent(room: string, event: string, payload: any) {
    this.io.to(room).emit(event, payload);
  }

  emitStreamUpdate(room: string, payload: any) {
    this.emitAvatarEvent(room, 'avatar:stream-update', payload);
  }

  emitSessionUpdate(room: string, payload: any) {
    this.emitAvatarEvent(room, 'avatar:session-update', payload);
  }
}
