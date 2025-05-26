// src/sockets/commentsSocket.js
const jwt = require('jsonwebtoken');
const Post = require('../models/postModel');
const User = require('../models/userModel');

const commentsSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      socket.user = decoded; // Attach user info to the socket
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    // Join a room for a specific post
    socket.on('joinPost', (postId) => {
      socket.join(postId);
      console.log(`User ${socket.user.id} joined post ${postId}`);
    });

    // Handle new comments
       socket.on('newComment', async ({ postId, comment }) => {
      if (!postId || !comment) {
        console.error('Invalid data: postId or comment is missing');
        return socket.emit('error', { message: 'Invalid data: postId or comment is missing' });
      }
    
      console.log(`New comment event received for post ${postId} by user ${socket.user.id}`);
      try {
        // Validate post existence
        const post = await Post.findById(postId);
        if (!post) {
          console.error(`Post not found: ${postId}`);
          return socket.emit('error', { message: 'Post not found' });
        }
    
        // Add comment to the post
        const newComment = {
          user: socket.user.id,
          text: comment,
          createdAt: new Date(),
        };
        post.comments.push(newComment);
        await post.save();
        console.log(`Comment added to post ${postId} by user ${socket.user.id}`);
    
        // Broadcast the new comment to all users in the post room
        io.to(postId).emit('commentAdded', {
          postId,
          comment: {
            ...newComment,
            user: await User.findById(socket.user.id).select('username'),
          },
        });
        console.log(`Comment broadcasted to post ${postId}`);
      } catch (err) {
        console.error('Error handling new comment:', err.message);
        socket.emit('error', { message: 'Failed to add comment' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });
};

module.exports = commentsSocket;