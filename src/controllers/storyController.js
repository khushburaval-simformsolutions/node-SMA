const storyService = require('../services/storyService');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const createStoryHandler = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, { errors: errors.array() });
    }

    const { mediaUrl, mediaType } = req.body;
    const story = await storyService.createStory(
      req.user.id,
      mediaUrl,
      mediaType
    );
    return successResponse(res, story, 201);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getUserStoriesHandler = async (req, res) => {
  try {
    const stories = await storyService.getStoriesByUserId(req.params.userId);
    return successResponse(res, stories);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getFeedStoriesHandler = async (req, res) => {
  try {
    const stories = await storyService.getFeedStories(req.user.id);
    return successResponse(res, stories);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const viewStoryHandler = async (req, res) => {
  try {
    const story = await storyService.viewStory(
      req.params.storyId, 
      req.user.id
    );
    return successResponse(res, story);
  } catch (err) {
    return errorResponse(res, err);
  }
};

module.exports = {
  createStoryHandler,
  getUserStoriesHandler,
  getFeedStoriesHandler,
  viewStoryHandler
};