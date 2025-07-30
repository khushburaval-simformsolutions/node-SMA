const Post = require('../models/postModel');
const { paginateResults, createPaginationResponse } = require('../utils/pagination');

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

  async getComments(postId, page = 1, limit = 10) {
    const { skip, limit: limitParsed } = paginateResults(page, limit);
    
    const post = await Post.findById(postId)
      .populate({
        path: 'comments.user',
        select: 'username',
        options: {
          skip: skip,
          limit: limitParsed,
          sort: { createdAt: -1 }
        }
      });

    if (!post) {
      throw new Error(`Post not found with id: ${postId}`);
    }

    return createPaginationResponse(
      post.comments || [], 
      post.comments.length,
      page,
      limit
    );
  }
};

module.exports = commentService;