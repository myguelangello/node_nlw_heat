import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import { router } from './routes';

const app = express();
app.use(cors());

/**
 * o serverHttp que vai subir o servidor
 * ao inves do app subir, para poder usar o websocket
 */
const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`User conected on socket ${socket.id}`);
});

app.use(express.json());

app.use(router);

app.get('/github', (request, response) => {
  response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

app.get('/signin/callback', (request, response) => {
  const { code } = request.query;

  return response.json(code);
});

export { serverHttp, io };
