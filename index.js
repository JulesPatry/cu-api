const express = require('express');
const http = require('http');

const app = express();
const _http = http.Server(app);
// const server = http.createServer(app);

// server.listen('3001', () => {
//   const msg = `v${packageJson.version} Server running in "${FP_ENVIRONMENT}" at: http://${HTTP_HOST}:${port}`;
//   slackMessage({ channel: CHANNELS.deployment, message: msg, logger, alert: true });
// });

const io = require('socket.io')(_http, { cors: { origin: '*' } });
io.on('connection', (socket) => {
  console.log('hit');
  socket.emit('hello', 'world');
  socket.on('hello2', (arg) => {
    console.log('arg', arg);
  });
});
