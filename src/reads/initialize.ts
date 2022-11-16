import { startGame, initGame, calculateTurn } from './actions';

export default ({ io }: any) => {
  io.on('init-game', initGame);

  io.on('start-game', startGame);

  io.on('calculate-turn', calculateTurn);
};

// socket.on('chat message', (msg) => {
//   io.emit('chat message', msg);
// });
