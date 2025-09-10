const feedService = require('../services/feedService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { validationResult } = require('express-validator');
const { extractHashtags } = require('../utils/hashtagExtractor');

const createFeedPreferenceHandler = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, { errors: errors.array() });
    }

    const preference = await feedService.createFeedPreference(
      req.user.id,
      req.body
    );
    return successResponse(res, preference, 201);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getUserPreferencesHandler = async (req, res) => {
  try {
    const preferences = await feedService.getUserFeedPreferences(req.user.id);
    return successResponse(res, preferences);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getCustomFeedHandler = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const feed = await feedService.getCustomFeed(
      req.user.id,
      req.params.preferenceId,
      parseInt(page),
      parseInt(limit)
    );
    return successResponse(res, feed);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const updateFeedPreferenceHandler = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, { errors: errors.array() });
    }

    const preference = await feedService.updateFeedPreference(
      req.user.id,
      req.params.preferenceId,
      req.body
    );
    return successResponse(res, preference);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const deleteFeedPreferenceHandler = async (req, res) => {
  try {
    await feedService.deleteFeedPreference(req.user.id, req.params.preferenceId);
    return successResponse(res, { message: 'Feed preference deleted successfully' });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getDefaultFeedHandler = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const feed = await feedService.getDefaultFeed(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );
    return successResponse(res, feed);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getTrendingTopicsHandler = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topics = await feedService.getTrendingTopics(limit);
    return successResponse(res, topics);
  } catch (err) {
    return errorResponse(res, err);
  }
};

module.exports = {
  createFeedPreferenceHandler,
  getCustomFeedHandler,
  getUserPreferencesHandler,
  updateFeedPreferenceHandler,
  deleteFeedPreferenceHandler,
  getDefaultFeedHandler,
  getTrendingTopicsHandler
};