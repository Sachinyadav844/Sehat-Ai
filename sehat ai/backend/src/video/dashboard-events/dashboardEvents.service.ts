import { Server } from 'socket.io';
import { prisma } from '../../database/client.js';

export class DashboardEventsService {
  constructor(private io: Server) {}

  async recordStatus(consultationId: string, userId: string, status: string) {
    const payload = {
      consultationId,
      userId,
      status,
      timestamp: new Date().toISOString(),
    };

    await prisma.dashboardEvent.create({
      data: {
        type: 'status',
        payload: JSON.stringify(payload),
      },
    });

    this.io.to(consultationId).emit('dashboard:status', payload);
    this.io.to(`dashboard:${userId}`).emit('dashboard:update', payload);

    return payload;
  }

  async recordEvent(consultationId: string, userId: string, type: string, data: any) {
    const payload = {
      consultationId,
      userId,
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    await prisma.dashboardEvent.create({
      data: {
        type,
        payload: JSON.stringify(payload),
      },
    });

    this.io.to(consultationId).emit('dashboard:event', payload);
    this.io.to(`dashboard:${userId}`).emit('dashboard:update', payload);

    return payload;
  }
}
