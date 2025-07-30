const Post = require('../models/postModel');
const Follower = require('../models/followerModel');
const { extractHashtags, extractTopics } = require('../utils/hashtagExtractor');
const { isValidMediaUrl, getMediaType } = require('../utils/mediaHandler');
const { paginateResults, createPaginationResponse } = require('../utils/pagination');

const getPosts = async (page = 1, limit = 10) => {
  const { skip, limit: limitParsed } = paginateResults(page, limit);
  
  const posts = await Post.find()
    .populate('user', 'username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitParsed);

  const total = await Post.countDocuments();
  
  return createPaginationResponse(posts, total, page, limit);
};

const updatePost = async (postId, userId, content) => {
  // Update hashtags and topics when content is updated
  const hashtags = extractHashtags(content);
  const topics = extractTopics(content);

  const post = await Post.findOneAndUpdate(
    { _id: postId, user: userId },
    { content, hashtags, topics },
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

const createPost = async (userId, content, mediaUrl = null) => {
   // Validate media URL if provided
   if (mediaUrl) {
    if (!isValidMediaUrl(mediaUrl)) {
      throw new Error('Invalid media URL');
    }
    const mediaType = getMediaType(mediaUrl);
    if (!mediaType) {
      throw new Error('Unsupported media type');
    }
  }

  // Extract hashtags and topics from content
  const hashtags = extractHashtags(content);
  const topics = extractTopics(content);
  
  const post = new Post({
    user: userId,
    content,
    mediaUrl,
    mediaType: mediaUrl ? getMediaType(mediaUrl) : null,
    hashtags,
    topics,  // Store both hashtags and topics
    likesCount: 0
  });

  return await post.save();
};

module.exports = { 
  createPost, 
  getPosts, 
  updatePost, 
  deletePost, 
  getPostById, 
  getUserPosts
};