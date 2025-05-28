// src/services/feedService.js
const Post = require('../models/postModel');
const FeedPreference = require('../models/feedPreferenceModel');
const Follower = require('../models/followerModel');
const logger = require('../utils/logger');

const feedService = {
  async createFeedPreference(userId, preferenceData) {
    logger.info('Creating new feed preference', { 
      userId, 
      preferenceName: preferenceData.name 
    });
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
    const preference = await FeedPreference.findOne({
      _id: preferenceId,
      user: userId
    });
    if (!preference) throw new Error('Feed preference not found');

    // Build query based on preferences
    const query = {};

    // Filter by specific users if defined, otherwise use followed users
    if (preference.filters.users && preference.filters.users.length > 0) {
      query.user = { $in: preference.filters.users };
    } else {
      const following = await Follower.find({ followerId: userId })
        .select('followingId');
      const followingIds = following.map(f => f.followingId);
      followingIds.push(userId); // Include user's own posts
      query.user = { $in: followingIds };
    }

    // Exclude specific users
    if (preference.filters.excludedUsers && preference.filters.excludedUsers.length > 0) {
      query.user = { 
        ...query.user, 
        $nin: preference.filters.excludedUsers 
      };
    }

    // Filter by topics if defined
    if (preference.filters.topics && preference.filters.topics.length > 0) {
      query.$or = [
        { content: { $regex: preference.filters.topics.join('|'), $options: 'i' } },
        { 'hashtags': { $in: preference.filters.topics } }
      ];
    }

    // Filter media-only posts if required
    if (preference.filters.mediaOnly) {
      query.mediaUrl = { $exists: true };
    }

    // Apply sorting
    let sort = { createdAt: -1 }; // Default recent
    if (preference.sortBy === 'popular') {
      sort = { likesCount: -1 };
    } else if (preference.sortBy === 'trending') {
      // Trending algorithm: (likes + comments) / hours_since_posted
      sort = { trendingScore: -1 };
    }

    const posts = await Post.find(query)
      .populate('user', 'username')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments(query);

    return {
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      preference
    };
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
  }
};

module.exports = feedService;