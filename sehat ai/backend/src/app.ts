import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { json } from 'body-parser';
import { authRouter } from './routes/auth.js';
import { consultationRouter } from './routes/consultation.js';
import { trugenRouter } from './routes/trugen.js';
import { videoRouter } from './routes/video.js';
import { reportRouter } from './routes/reports.js';
import { emergencyRouter } from './routes/emergency.js';
import { ragRouter } from './routes/rag.js';
import { medicalRouter } from './routes/medical.js';
import { prisma } from './database/client.js';
import { healthRouter } from './routes/health.routes.js';
import { languageMiddleware } from './middleware/language.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(json({ limit: '50mb' }));
app.use(morgan('combined'));

app.use(rateLimit({ windowMs: 1000 * 60, max: 300 }));

// language detection for incoming API requests
app.use(languageMiddleware);

app.use('/health', healthRouter);

app.use('/api/auth', authRouter);
app.use('/api/consultation', consultationRouter);
app.use('/api/video', videoRouter);
app.use('/api/reports', reportRouter);
app.use('/api/emergency', emergencyRouter);
app.use('/api/rag', ragRouter);
app.use('/api/medical', medicalRouter);
app.use('/api/trugen', trugenRouter);

export default app;
