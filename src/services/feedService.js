// src/services/feedService.js
const Post = require('../models/postModel');
const FeedPreference = require('../models/feedPreferenceModel');
const Follower = require('../models/followerModel');
const logger = require('../utils/logger');
const { extractHashtags, extractTopics } = require('../utils/hashtagExtractor');

const feedService = {
  async createFeedPreference(userId, preferenceData) {
    logger.info('Creating feed preference', { userId });
    
    // Extract hashtags and topics if topics filter exists
    if (preferenceData.filters?.topics) {
      const extractedHashtags = preferenceData.filters.topics
        .map(topic => extractHashtags(topic))
        .flat();
      const extractedTopics = preferenceData.filters.topics
        .map(topic => extractTopics(topic))
        .flat();
      
      // Combine and deduplicate topics and hashtags
      preferenceData.filters.topics = [...new Set([
        ...extractedHashtags,
        ...extractedTopics
      ])];
    }

    const preference = new FeedPreference({
      user: userId,
      ...preferenceData
    });
    return await preference.save();
  },

  async updateFeedPreference(userId, preferenceId, updates) {
    const preference = await FeedPreference.findOneAndUpdate(
      { _id: preferenceId, user: userId },
      updates,
      { new: true }
    );
    if (!preference) throw new Error('Feed preference not found');
    return preference;
  },

  async getCustomFeed(userId, preferenceId, page = 1, limit = 10) {
    const preference = await FeedPreference.findById(preferenceId);
    const query = {};

    // Apply topic and hashtag filters
    if (preference.filters?.topics?.length > 0) {
      const topicHashtags = preference.filters.topics
        .map(topic => extractHashtags(topic))
        .flat();
      
      query.$or = [
        { hashtags: { $in: topicHashtags } },
        { topics: { $in: preference.filters.topics } }
      ];
    }

    // Rest of the feed query logic
    return await Post.find(query)
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  },

  async getUserFeedPreferences(userId) {
    return await FeedPreference.find({ user: userId });
  },

  async deleteFeedPreference(userId, preferenceId) {
    const result = await FeedPreference.findOneAndDelete({
      _id: preferenceId,
      user: userId
    });
    if (!result) throw new Error('Feed preference not found');
    return result;
  },

  async getTrendingTopics(limit = 10) {
    const posts = await Post.aggregate([
      { $unwind: '$hashtags' },
      {
        $group: {
          _id: '$hashtags',
          count: { $sum: 1 },
          recentPosts: { $max: '$createdAt' }
        }
      },
      { $sort: { count: -1, recentPosts: -1 } },
      { $limit: limit }
    ]);
    
    return posts;
  },

  async getDefaultFeed(userId, page = 1, limit = 10) {
    // Get posts from followed users without specific preferences
    const following = await Follower.find({ followerId: userId })
      .select('followingId');
    const followingIds = following.map(f => f.followingId);
    followingIds.push(userId);

    const posts = await Post.find({ user: { $in: followingIds } })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ 
      user: { $in: followingIds } 
    });

    return {
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    };
  }
};

module.exports = feedService;