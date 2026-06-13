import { Request, Response } from 'express';
import { prisma } from '../database/client.js';
import axios from 'axios';

export async function escalateEmergency(req: Request, res: Response) {
  try {
    const userId = (req as any).user.sub;
    const { consultationId, type, message } = req.body;

    if (!consultationId || !type) {
      return res.status(400).json({
        ok: false,
        message: 'Missing required fields',
      });
    }

    // Verify consultation belongs to user
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation || consultation.userId !== userId) {
      return res.status(403).json({
        ok: false,
        message: 'Unauthorized',
      });
    }

    // Create emergency event
    const emergency = await prisma.emergencyEvent.create({
      data: {
        consultationId,
        type,
        message: message || 'Emergency escalation',
      },
    });

    // TODO: Send notification to emergency services/doctors
    // TODO: Update consultation status to 'emergency'

    res.json({
      ok: true,
      emergency: {
        id: emergency.id,
        type: emergency.type,
        message: emergency.message,
        createdAt: emergency.createdAt,
      },
    });
  } catch (error) {
    console.error('Emergency escalation error:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to escalate emergency',
      error: (error as Error).message,
    });
  }
}

export async function getEmergencyEvents(req: Request, res: Response) {
  try {
    const userId = (req as any).user.sub;
    const { consultationId } = req.params;

    if (!consultationId) {
      return res.status(400).json({
        ok: false,
        message: 'Missing consultationId',
      });
    }

    // Verify consultation belongs to user
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation || consultation.userId !== userId) {
      return res.status(403).json({
        ok: false,
        message: 'Unauthorized',
      });
    }

    const events = await prisma.emergencyEvent.findMany({
      where: { consultationId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      ok: true,
      events,
    });
  } catch (error) {
    console.error('Get emergency events error:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to get emergency events',
      error: (error as Error).message,
    });
  }
}

export async function resolveEmergency(req: Request, res: Response) {
  try {
    const userId = (req as any).user.sub;
    const { emergencyId } = req.body;

    if (!emergencyId) {
      return res.status(400).json({
        ok: false,
        message: 'Missing emergencyId',
      });
    }

    const emergency = await prisma.emergencyEvent.findUnique({
      where: { id: emergencyId },
      include: {
        consultation: {
          select: { userId: true },
        },
      },
    });

    if (!emergency || emergency.consultation.userId !== userId) {
      return res.status(403).json({
        ok: false,
        message: 'Unauthorized',
      });
    }

    const resolved = await prisma.emergencyEvent.update({
      where: { id: emergencyId },
      data: { resolved: true },
    });

    res.json({
      ok: true,
      emergency: resolved,
    });
  } catch (error) {
    console.error('Resolve emergency error:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to resolve emergency',
      error: (error as Error).message,
    });
  }
}

export async function getDashboardEvents(req: Request, res: Response) {
  try {
    const userId = (req as any).user.sub;
    const { consultationId } = req.params;

    if (!consultationId) {
      return res.status(400).json({
        ok: false,
        message: 'Missing consultationId',
      });
    }

    // Verify consultation belongs to user
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation || consultation.userId !== userId) {
      return res.status(403).json({
        ok: false,
        message: 'Unauthorized',
      });
    }

    // Get consultation data for dashboard
    const fullConsultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        transcripts: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        symptoms: true,
        risk: true,
        appointments: true,
        emergencyEvents: true,
      },
    });

    res.json({
      ok: true,
      consultation: fullConsultation,
    });
  } catch (error) {
    console.error('Get dashboard events error:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to get dashboard events',
      error: (error as Error).message,
    });
  }
}

export async function updateDashboardStatus(req: Request, res: Response) {
  try {
    const { consultationId, status } = req.body;

    if (!consultationId || !status) {
      return res.status(400).json({
        ok: false,
        message: 'Missing required fields',
      });
    }

    const consultation = await prisma.consultation.update({
      where: { id: consultationId },
      data: { status },
    });

    res.json({
      ok: true,
      consultation,
    });
  } catch (error) {
    console.error('Update dashboard status error:', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to update status',
      error: (error as Error).message,
    });
  }
}
