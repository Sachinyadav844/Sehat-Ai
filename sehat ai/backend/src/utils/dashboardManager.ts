import { Server } from 'socket.io';

export interface DashboardUpdate {
  type: string;
  consultationId: string;
  userId: string;
  data: any;
  timestamp: Date;
}

export class DashboardManager {
  private io: Server;
  private updates: Map<string, DashboardUpdate[]> = new Map();

  constructor(io: Server) {
    this.io = io;
  }

  emitSymptomUpdate(consultationId: string, userId: string, symptoms: any[]) {
    const update: DashboardUpdate = {
      type: 'symptom:detected',
      consultationId,
      userId,
      data: symptoms,
      timestamp: new Date(),
    };

    this.sendUpdate(update);
  }

  emitRiskUpdate(consultationId: string, userId: string, riskAssessment: any) {
    const update: DashboardUpdate = {
      type: 'risk:updated',
      consultationId,
      userId,
      data: riskAssessment,
      timestamp: new Date(),
    };

    this.sendUpdate(update);
  }

  emitReportUpdate(consultationId: string, userId: string, report: any) {
    const update: DashboardUpdate = {
      type: 'report:generated',
      consultationId,
      userId,
      data: report,
      timestamp: new Date(),
    };

    this.sendUpdate(update);
  }

  emitHospitalUpdate(consultationId: string, userId: string, hospitals: any[]) {
    const update: DashboardUpdate = {
      type: 'hospitals:found',
      consultationId,
      userId,
      data: hospitals,
      timestamp: new Date(),
    };

    this.sendUpdate(update);
  }

  emitAppointmentUpdate(consultationId: string, userId: string, appointment: any) {
    const update: DashboardUpdate = {
      type: 'appointment:booked',
      consultationId,
      userId,
      data: appointment,
      timestamp: new Date(),
    };

    this.sendUpdate(update);
  }

  emitEmergencyAlert(consultationId: string, userId: string, alert: any) {
    const update: DashboardUpdate = {
      type: 'emergency:alert',
      consultationId,
      userId,
      data: alert,
      timestamp: new Date(),
    };

    this.sendUpdate(update);
  }

  private sendUpdate(update: DashboardUpdate) {
    // Store update
    const key = `dashboard:${update.userId}`;
    if (!this.updates.has(key)) {
      this.updates.set(key, []);
    }
    this.updates.get(key)!.push(update);

    // Emit to user's dashboard room
    this.io.to(`dashboard:${update.userId}`).emit('dashboard:update', update);

    // Also emit to consultation room
    this.io.to(update.consultationId).emit('consultation:dashboard-update', update);
  }

  getUpdates(userId: string, limit: number = 50): DashboardUpdate[] {
    const key = `dashboard:${userId}`;
    const updates = this.updates.get(key) || [];
    return updates.slice(-limit);
  }

  clearUpdates(userId: string) {
    const key = `dashboard:${userId}`;
    this.updates.delete(key);
  }
}

export class NotificationManager {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  notifySymptomDetected(userId: string, symptoms: string[]) {
    this.io.to(`user:${userId}`).emit('notification', {
      type: 'symptom_detected',
      message: `${symptoms.length} symptoms detected: ${symptoms.join(', ')}`,
      severity: 'info',
      timestamp: new Date(),
    });
  }

  notifyRiskLevel(userId: string, riskLevel: string, score: number) {
    const severity = riskLevel === 'critical' ? 'critical' : 'warning';
    this.io.to(`user:${userId}`).emit('notification', {
      type: 'risk_level_update',
      message: `Risk level: ${riskLevel} (Score: ${score.toFixed(2)})`,
      severity,
      timestamp: new Date(),
    });
  }

  notifyEmergency(userId: string, message: string) {
    this.io.to(`user:${userId}`).emit('notification', {
      type: 'emergency',
      message,
      severity: 'critical',
      timestamp: new Date(),
    });
  }

  notifyAppointmentBooked(userId: string, hospitalName: string, date: string) {
    this.io.to(`user:${userId}`).emit('notification', {
      type: 'appointment_booked',
      message: `Appointment booked at ${hospitalName} on ${date}`,
      severity: 'success',
      timestamp: new Date(),
    });
  }

  notifyReportReady(userId: string, reportId: string) {
    this.io.to(`user:${userId}`).emit('notification', {
      type: 'report_ready',
      message: 'Your medical report is ready',
      severity: 'info',
      reportId,
      timestamp: new Date(),
    });
  }
}
