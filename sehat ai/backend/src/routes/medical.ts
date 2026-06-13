import { Router } from 'express';
import { medicalRetrieve, medicalValidate } from '../controllers/medicalController.js';
import { requireAuth } from '../middleware/auth.js';

export const medicalRouter = Router();

medicalRouter.post('/retrieve', requireAuth, medicalRetrieve);
medicalRouter.post('/validate', requireAuth, medicalValidate);
