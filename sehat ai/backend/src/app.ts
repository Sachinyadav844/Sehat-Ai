import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { authRouter } from './routes/auth.js';
import { consultationRouter } from './routes/consultation.js';
import { trugenRouter } from './routes/trugen.js';
import { videoRouter } from './routes/video.js';
import { aiGatewayRouter } from './routes/aiGateway.js';
import { reportRouter } from './routes/reports.js';
import { emergencyRouter } from './routes/emergency.js';
import { ragRouter } from './routes/rag.js';
import { medicalRouter } from './routes/medical.js';
import { healthRouter } from './routes/health.routes.js';
import { languageMiddleware } from './middleware/language.js';
import { config } from './config/index.js';

const app = express();

const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
].filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      return callback(null, allowedOrigins.includes(origin));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);
app.use(json({ limit: '50mb' }));
app.use(morgan('combined'));

app.use(rateLimit({ windowMs: 1000 * 60, max: 300 }));

// language detection for incoming API requests
app.use(languageMiddleware);

app.get('/', (_req, res) => {
  res.json({
    name: 'SehatAI Backend',
    status: 'running',
    version: '1.0.0',
  });
});

app.use('/health', healthRouter);
app.use('/api/health', healthRouter);

app.use('/api/auth', authRouter);
app.use('/api/consultation', consultationRouter);
app.use('/api/video', videoRouter);
app.use('/api/ai-gateway', aiGatewayRouter);
app.use('/api/reports', reportRouter);
app.use('/api/emergency', emergencyRouter);
app.use('/api/rag', ragRouter);
app.use('/api/medical', medicalRouter);
app.use('/api/trugen', trugenRouter);

export default app;
