import { prisma } from '../../database/client.js';

export class EmergencyService {
  async createEmergencyAlert(consultationId: string, type: string, message: string) {
    const emergency = await prisma.emergencyEvent.create({
      data: {
        consultationId,
        type,
        message,
      },
    });

    await prisma.consultation.update({
      where: { id: consultationId },
      data: { status: 'emergency' },
    });

    return emergency;
  }

  async logEmergencyCase(consultationId: string, description: string, severity: string, outcome?: string) {
    await prisma.$executeRaw`
      INSERT INTO "EmergencyCase" ("consultationId", "description", "severity", "outcome", "reportedAt")
      VALUES (${consultationId}, ${description}, ${severity}, ${outcome}, ${new Date()})`;

    return {
      consultationId,
      description,
      severity,
      outcome,
    };
  }
}
