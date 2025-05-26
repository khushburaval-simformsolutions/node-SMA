const app = require('./app');
const connectDB = require('./config/db');
const http = require('http');
const { initSocket } = require('./sockets/socket');
const commentsSocket = require('./sockets/commentsSocket');

connectDB();

const server = http.createServer(app);
const io = initSocket(server);

// Initialize WebSocket logic
commentsSocket(io);

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});