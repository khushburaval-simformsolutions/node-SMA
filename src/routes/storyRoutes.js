const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const {
  createStoryHandler,
  getUserStoriesHandler,
  getFeedStoriesHandler,
  viewStoryHandler
} = require('../controllers/storyController');

// Validation middleware
const createStoryValidation = [
  body('mediaUrl').notEmpty().isURL(),
  body('mediaType').isIn(['image', 'video'])
];

// Routes
router.post('/', authMiddleware, createStoryValidation, createStoryHandler);
router.get('/user/:userId', authMiddleware, getUserStoriesHandler);
router.get('/feed', authMiddleware, getFeedStoriesHandler);
router.post('/:storyId/view', authMiddleware, viewStoryHandler);

module.exports = router;