import { v4 as uuidv4 } from 'uuid';

export default function initGame(socket: any) {
  socket.on('init-game', () => {
    socket.emit('game-id', uuidv4());
  });
}
