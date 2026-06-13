import { Router } from 'express';
import {
  generateReport,
  getReport,
  listReports,
  deleteReport,
  downloadReport,
} from '../controllers/reportController.js';
import { requireAuth } from '../middleware/auth.js';

export const reportRouter = Router();

reportRouter.post('/generate', requireAuth, generateReport);
reportRouter.get('/list', requireAuth, listReports);
reportRouter.get('/:reportId', requireAuth, getReport);
reportRouter.delete('/:reportId', requireAuth, deleteReport);
reportRouter.get('/:reportId/download', requireAuth, downloadReport);
