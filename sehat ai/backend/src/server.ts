import http from 'http';
import axios from 'axios';
import { Server } from 'socket.io';
import app from './app.js';
import { config } from './config/index.js';
import { initSocket } from './socket/index.js';
import { prisma } from './database/client.js';
import { redisClient } from './database/redisClient.js';

async function verifyDependencies() {
  try {
    await prisma.$connect();
    console.log('Database Connected');
  } catch (error) {
    console.error('Database connection failure:', error);
  }

  try {
    const pong = await redisClient.ping();
    if (pong === 'PONG') {
      console.log('Redis Connected');
    } else {
      console.warn('Redis ping did not return PONG:', pong);
    }
  } catch (error) {
    console.error('Redis connection failure:', error);
  }

  try {
    const healthUrl = `${config.aiGatewayUrl.replace(/\/\/$/, '')}/health`;
    const response = await axios.get(healthUrl, { timeout: 3000 });
    if (response.status === 200) {
      console.log('AI Services Connected');
    } else {
      console.warn('AI service health endpoint returned non-200 status:', response.status);
    }
  } catch (error) {
    console.warn('AI Services connectivity could not be verified:', error instanceof Error ? error.message : String(error));
  }
}

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

initSocket(io);

verifyDependencies().finally(() => {
  server.listen(config.port, () => {
    console.log(`Sehat AI backend listening on ${config.port}`);
    console.log('Server Started');
  });
});
