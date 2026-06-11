import app from './app';
import { SeverityService } from './core/severity.service';

export const createApp = (): typeof app => app;
export const analyzeSeverity = async (payload: unknown) => {
  const service = new SeverityService();
  return service.analyzeSeverity(payload as any);
};
