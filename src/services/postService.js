// src/services/postService.js
const Post = require('../models/postModel');
const Follower = require('../models/followerModel');

const createPost = async (userId, content) => {
  const post = new Post({ user: userId, content });
  return await post.save();
};

const getPosts = async () => {
  return await Post.find().populate('user', 'username').sort({ createdAt: -1 });
};

const updatePost = async (postId, userId, content) => {
  const post = await Post.findOneAndUpdate(
    { _id: postId, user: userId },
    { content },
    { new: true }
  );
  if (!post) throw new Error('Post not found or unauthorized');
  return post;
};

const deletePost = async (postId, userId) => {
  const post = await Post.findOneAndDelete({ _id: postId, user: userId });
  if (!post) throw new Error('Post not found or unauthorized');
  return post;
};

const getPostById = async (postId) => {
  const post = await Post.findById(postId).populate('user', 'username');
  if (!post) throw new Error('Post not found');
  return post;
};

const getUserPosts = async (userId) => {
  return await Post.find({ user: userId }).populate('user', 'username').sort({ createdAt: -1 });
};

const generateFeed = async (userId, page = 1, limit = 10) => {
  // Find users the current user is following
  const following = await Follower.find({ followerId: userId }).select('followingId');
  const followingIds = following.map(f => f.followingId);

  // Include the current user's posts in the feed
  followingIds.push(userId);

  // Fetch posts from the followed users in reverse chronological order
  const posts = await Post.find({ user: { $in: followingIds } })
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip((page - 1) * limit) // Skip posts for pagination
    .limit(parseInt(limit)); // Limit the number of posts

  // Count total posts for pagination metadata
  const totalPosts = await Post.countDocuments({ user: { $in: followingIds } });

  return {
    posts,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts,
  };
};

module.exports = { 
  createPost, 
  getPosts, 
  updatePost, 
  deletePost, 
  getPostById, 
  getUserPosts, 
  generateFeed
};