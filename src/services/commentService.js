const Post = require("../models/postModel");
const User = require("../models/userModel");
const {
  paginateResults,
  createPaginationResponse,
} = require("../utils/pagination");

const commentService = {
  async addComment(postId, userId, text) {
    console.log(`Adding comment to post ${postId} by user ${userId}`);

    if (!postId || !userId || !text) {
      throw new Error("Missing required fields");
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error(`Post not found with id: ${postId}`);
    }

    const newComment = {
      user: userId,
      text: text,
      createdAt: new Date(),
    };

    post.comments = post.comments || [];
    post.comments.push(newComment);

    try {
      await post.save();
      console.log(`Comment saved successfully to post ${postId}`);

      // Return populated comment
      const updatedPost = await Post.findById(postId).populate(
        "comments.user",
        "username"
      );
      return updatedPost.comments[updatedPost.comments.length - 1];
    } catch (error) {
      console.error("Error saving comment:", error);
      throw new Error("Failed to save comment");
    }
  },

  async getComments(postId, page = 1, limit = 10) {
    const { skip, limit: limitParsed } = paginateResults(page, limit);

    // Fetch the post and sort the comments manually
    const post = await Post.findById(postId)
      .select("comments") // Only fetch the comments field
      .lean(); // Convert the Mongoose document to a plain JavaScript object

    if (!post) {
      throw new Error(`Post not found with id: ${postId}`);
    }

    // Sort the comments array manually by `createdAt` in descending order
    const sortedComments = post.comments
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + limitParsed); // Apply pagination

    // Populate the `user` field for each comment
    const populatedComments = await Promise.all(
      sortedComments.map(async (comment) => {
        const user = await User.findById(comment.user).select("username");
        return { ...comment, user };
      })
    );

    return createPaginationResponse(
      populatedComments,
      post.comments.length, // Total number of comments
      page,
      limit
    );
  },
};

module.exports = commentService;
