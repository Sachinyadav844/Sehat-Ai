import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {service: 'safety-agent'},
  timestamp: pino.stdTimeFunctions.isoTime
});

export function logInfo(message: string, data: Record<string, unknown> = {}) {
  logger.info({...data, event: message});
}

export function logWarn(message: string, data: Record<string, unknown> = {}) {
  logger.warn({...data, event: message});
}

export function logError(message: string, data: Record<string, unknown> = {}) {
  logger.error({...data, event: message});
}

export default logger;
