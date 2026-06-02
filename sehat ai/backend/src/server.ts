import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { config } from './config/index.js';
import { initSocket } from './socket/index.js';

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

initSocket(io);

server.listen(config.port, () => {
  console.log(`Sehat AI backend listening on ${config.port}`);
});
