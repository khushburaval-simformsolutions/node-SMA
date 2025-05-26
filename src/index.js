const app = require('./app');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const commentsSocket = require('./sockets/commentsSocket');

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for development; restrict in production
  },
});

// Initialize WebSocket logic
commentsSocket(io);

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});