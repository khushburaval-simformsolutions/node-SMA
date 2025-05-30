const app = require('./app');
const connectDB = require('./config/db');
const http = require('http');
const { initSocket } = require('./sockets/socket');
const commentsSocket = require('./sockets/commentsSocket');
const storyService = require('./services/storyService');
const config = require('./config/config');

connectDB();

const server = http.createServer(app);
const io = initSocket(server);

// Initialize WebSocket logic
commentsSocket(io);
storyService.scheduleCleanup();

server.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});