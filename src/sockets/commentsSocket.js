// src/sockets/commentsSocket.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const commentService = require('../services/commentService');
const logger = require('../utils/logger');

const commentsSocket = (io) => {
  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info('New socket connection', { 
      userId: socket.user?.id,
      socketId: socket.id 
    });

    // Track user's active rooms
    socket.activeRooms = new Set();

    // Join a post's room
    socket.on('joinPost', (postId) => {
      if (!postId) {
        return socket.emit('error', { message: 'Invalid post ID' });
      }
      socket.join(postId);
      socket.activeRooms.add(postId);
      logger.debug('User joined post room', {
        userId: socket.user?.id,
        postId,
        socketId: socket.id
      });
    });

    // Leave a post's room
    socket.on('leavePost', (postId) => {
      if (socket.activeRooms.has(postId)) {
        socket.leave(postId);
        socket.activeRooms.delete(postId);
        console.log(`User ${socket.user.id} left post ${postId}`);
      }
    });

    // Handle typing indicators
    socket.on('typing', ({ postId }) => {
      socket.to(postId).emit('userTyping', {
        postId,
        userId: socket.user.id
      });
    });

    socket.on('stopTyping', ({ postId }) => {
      socket.to(postId).emit('userStoppedTyping', {
        postId,
        userId: socket.user.id
      });
    });

    // Handle new comments
    socket.on('newComment', async ({ postId, comment }) => {
      if (!postId || !comment) {
        return socket.emit('error', { 
          message: 'Invalid data: postId or comment is missing'
        });
      }

      try {
        const newComment = await commentService.addComment(
          postId,
          socket.user.id,
          comment
        );

        // Broadcast to all users in the post room
        io.to(postId).emit('commentAdded', {
          postId,
          comment: {
            ...newComment.toObject(),
            user: await User.findById(socket.user.id).select('username')
          }
        });

        console.log(`Comment broadcasted to post ${postId}`);
      } catch (err) {
        console.error('Error handling new comment:', err.message);
        socket.emit('error', { message: err.message });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
      // Clean up rooms
      socket.activeRooms.forEach(room => {
        socket.leave(room);
      });
      socket.activeRooms.clear();
    });
  });
};

module.exports = commentsSocket;