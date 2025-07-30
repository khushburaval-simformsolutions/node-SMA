const { Server } = require('socket.io');
let io;

const initSocket = (server) => {
  io = new Server(server,{
    cors: {
      origin: '*', // Allow all origins for development; restrict in production
    },
  });
  
  return io;
};

module.exports = {
  initSocket,
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized');
    }
    return io;
  }
};