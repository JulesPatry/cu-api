const Server = require('socket.io');
const io = Server(3001);
io.on('connection', (socket) => {
  console.log('hit');
  socket.emit('hello', 'world');
  socket.on('hello2', (arg) => {
    console.log('arg', arg);
  });
});
