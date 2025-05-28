// src/routes/feedRoutes.js
const express = require('express');
const router = express.Router();
const feedService = require('../services/feedService');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');

// Create new feed preference
router.post('/', 
  authMiddleware,
  [
    body('name').notEmpty().withMessage('Feed name is required'),
    body('filters').optional().isObject(),
    body('sortBy').optional().isIn(['recent', 'popular', 'trending'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const preference = await feedService.createFeedPreference(
        req.user.id,
        req.body
      );
      res.status(201).json(preference);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Get custom feed based on preference
router.get('/:preferenceId', authMiddleware, async (req, res) => {
  try {
    const { page, limit } = req.query;
    const feed = await feedService.getCustomFeed(
      req.user.id,
      req.params.preferenceId,
      page,
      limit
    );
    res.json(feed);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all feed preferences for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const preferences = await feedService.getUserFeedPreferences(req.user.id);
    res.json(preferences);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update feed preference
router.put('/:preferenceId',
  authMiddleware,
  [
    body('name').optional().notEmpty(),
    body('filters').optional().isObject(),
    body('sortBy').optional().isIn(['recent', 'popular', 'trending'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const preference = await feedService.updateFeedPreference(
        req.user.id,
        req.params.preferenceId,
        req.body
      );
      res.json(preference);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Delete feed preference
router.delete('/:preferenceId', authMiddleware, async (req, res) => {
  try {
    await feedService.deleteFeedPreference(req.user.id, req.params.preferenceId);
    res.json({ message: 'Feed preference deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get default feed (no preferences)
router.get('/default', authMiddleware, async (req, res) => {
  try {
    const { page, limit } = req.query;
    const feed = await feedService.getDefaultFeed(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );
    res.json(feed);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get trending topics
router.get('/trending/topics', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topics = await feedService.getTrendingTopics(limit);
    res.json(topics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;