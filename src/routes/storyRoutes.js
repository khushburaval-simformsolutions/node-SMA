const express = require('express');
const router = express.Router();
const storyService = require('../services/storyService');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');

// Create a story
router.post('/', 
  authMiddleware,
  [
    body('mediaUrl').notEmpty().isURL(),
    body('mediaType').isIn(['image', 'video'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { mediaUrl, mediaType } = req.body;
      const story = await storyService.createStory(
        req.user.id,
        mediaUrl,
        mediaType
      );
      res.status(201).json(story);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Get user's stories
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const stories = await storyService.getStoriesByUserId(req.params.userId);
    res.json(stories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get stories feed
router.get('/feed', authMiddleware, async (req, res) => {
  try {
    const stories = await storyService.getFeedStories(req.user.id);
    res.json(stories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Mark story as viewed
router.post('/:storyId/view', authMiddleware, async (req, res) => {
  try {
    const story = await storyService.viewStory(req.params.storyId, req.user.id);
    res.json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;