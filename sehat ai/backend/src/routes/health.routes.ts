import axios from 'axios';
import { Router } from 'express';
import { prisma } from '../database/client.js';
import { redisClient } from '../database/redisClient.js';
import { config } from '../config/index.js';

export const healthRouter = Router();

const checkEndpoint = async (url: string) => {
  try {
    const response = await axios.get(`${url.replace(/\/$/, '')}/health`, { timeout: 3000 });
    return {
      healthy: response.status >= 200 && response.status < 300,
      statusCode: response.status,
      details: response.data,
    };
  } catch (error) {
    return {
      healthy: false,
      statusCode: (error as any)?.response?.status || 503,
      details: (error as Error).message,
    };
  }
};

healthRouter.get('/', async (_req, res) => {
  const healthStatus = {
    status: 'healthy',
    server: 'running',
    database: 'connected',
    agents: 'unknown',
    rag: 'unknown',
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    healthStatus.status = 'unhealthy';
    healthStatus.database = 'disconnected';
  }

  try {
    const pong = await redisClient.ping();
    if (pong !== 'PONG') {
      healthStatus.status = 'unhealthy';
      healthStatus.database = 'disconnected';
    }
  } catch (err) {
    healthStatus.status = 'unhealthy';
    healthStatus.database = 'disconnected';
  }

  const agentHealth = await checkEndpoint(config.aiGatewayUrl || config.aiServiceUrl);
  healthStatus.agents = agentHealth.healthy ? 'healthy' : 'unhealthy';

  const ragHealth = await checkEndpoint(config.aiServiceUrl);
  healthStatus.rag = ragHealth.healthy ? 'healthy' : 'unhealthy';

  if (!agentHealth.healthy || !ragHealth.healthy || healthStatus.database === 'disconnected') {
    healthStatus.status = 'unhealthy';
  }

  return res.json({
    ...healthStatus,
    agentHealth,
    ragHealth,
  });
});

healthRouter.get('/agents', async (_req, res) => {
  const agentCheck = await checkEndpoint(config.aiGatewayUrl || config.aiServiceUrl);
  return res.json({
    service: config.aiGatewayUrl || config.aiServiceUrl,
    healthy: agentCheck.healthy,
    statusCode: agentCheck.statusCode,
    details: agentCheck.details,
  });
});

healthRouter.get('/rag', async (_req, res) => {
  const ragCheck = await checkEndpoint(config.aiServiceUrl);
  return res.json({
    service: config.aiServiceUrl,
    healthy: ragCheck.healthy,
    statusCode: ragCheck.statusCode,
    details: ragCheck.details,
  });
});

healthRouter.get('/database', async (_req, res) => {
  const status = {
    healthy: true,
    database: 'connected',
    redis: 'connected',
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    status.healthy = false;
    status.database = 'disconnected';
  }

  try {
    const pong = await redisClient.ping();
    if (pong !== 'PONG') {
      status.healthy = false;
      status.redis = 'disconnected';
    }
  } catch (err) {
    status.healthy = false;
    status.redis = 'disconnected';
  }

  return res.json(status);
});
