
// src/services/postService.js
const Post = require('../models/postModel');

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

module.exports = { createPost, getPosts, updatePost, deletePost };