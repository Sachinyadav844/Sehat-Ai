import { Router } from 'express';
import {
  escalateEmergency,
  getEmergencyEvents,
  resolveEmergency,
  getDashboardEvents,
  updateDashboardStatus,
} from '../controllers/emergencyController.js';
import { requireAuth } from '../middleware/auth.js';

export const emergencyRouter = Router();

// Emergency Management
emergencyRouter.post('/escalate', requireAuth, escalateEmergency);
emergencyRouter.get('/events/:consultationId', requireAuth, getEmergencyEvents);
emergencyRouter.post('/resolve', requireAuth, resolveEmergency);

// Dashboard
emergencyRouter.get('/dashboard/:consultationId', requireAuth, getDashboardEvents);
emergencyRouter.post('/dashboard/status', requireAuth, updateDashboardStatus);
