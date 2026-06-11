import express from 'express';
import severityRoutes from './api/severity.routes';
import { logEvent } from './logging';

const app = express();
app.use(express.json({ limit: '50kb' }));
app.use((req, _res, next) => {
  logEvent('Request Received', { method: req.method, path: req.path });
  next();
});
app.use('/', severityRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logEvent('Errors', { error: err instanceof Error ? err.message : 'Unknown error' });
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
