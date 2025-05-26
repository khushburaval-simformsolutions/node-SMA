// src/services/commentService.js
const Post = require('../models/postModel');

const commentService = {
  async addComment(postId, userId, text) {
    console.log(`Adding comment to post ${postId} by user ${userId}`);
    
    if (!postId || !userId || !text) {
      throw new Error('Missing required fields');
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error(`Post not found with id: ${postId}`);
    }

    const newComment = {
      user: userId,
      text: text,
      createdAt: new Date()
    };

    post.comments = post.comments || [];
    post.comments.push(newComment);

    try {
      await post.save();
      console.log(`Comment saved successfully to post ${postId}`);
      
      // Return populated comment
      const updatedPost = await Post.findById(postId)
        .populate('comments.user', 'username');
      return updatedPost.comments[updatedPost.comments.length - 1];
    } catch (error) {
      console.error('Error saving comment:', error);
      throw new Error('Failed to save comment');
    }
  },

  async getComments(postId) {
    console.log(`Fetching comments for post ${postId}`);
    
    const post = await Post.findById(postId)
      .populate('comments.user', 'username');
    
    if (!post) {
      throw new Error(`Post not found with id: ${postId}`);
    }

    return post.comments || [];
  }
};

module.exports = commentService;