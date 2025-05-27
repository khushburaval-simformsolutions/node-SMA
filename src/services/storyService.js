const Story = require('../models/storyModel');
const { scheduleJob } = require('node-schedule');

const storyService = {
  async createStory(userId, mediaUrl, mediaType) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    const story = new Story({
      user: userId,
      mediaUrl,
      mediaType,
      expiresAt
    });

    return await story.save();
  },

  async getStoriesByUserId(userId) {
    return await Story.find({
      user: userId,
      expiresAt: { $gt: new Date() }
    }).populate('user', 'username');
  },

  async getFeedStories(userId) {
    const stories = await Story.find({
      expiresAt: { $gt: new Date() }
    })
    .populate('user', 'username')
    .populate('views.user', 'username')
    .sort('-createdAt');

    return stories;
  },

  async viewStory(storyId, viewerId) {
    const story = await Story.findById(storyId);
    if (!story) throw new Error('Story not found');

    // Check if user already viewed the story
    const alreadyViewed = story.views.some(view => 
      view.user.toString() === viewerId.toString()
    );

    if (!alreadyViewed) {
      story.views.push({ user: viewerId });
      await story.save();
    }

    return story;
  },

  // Background job to clean up expired stories
  scheduleCleanup() {
    // Run every hour
    scheduleJob('0 * * * *', async () => {
      try {
        const now = new Date();
        await Story.deleteMany({ expiresAt: { $lte: now } });
        console.log('Cleaned up expired stories');
      } catch (error) {
        console.error('Error cleaning up stories:', error);
      }
    });
  }
};

module.exports = storyService;