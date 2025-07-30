const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const {
  createFeedPreferenceHandler,
  getCustomFeedHandler,
  getUserPreferencesHandler,
  updateFeedPreferenceHandler,
  deleteFeedPreferenceHandler,
  getDefaultFeedHandler,
  getTrendingTopicsHandler,
  searchFeedHandler,
  getTrendingHashtagsHandler
} = require('../controllers/feedController');

// Validation middleware
const createFeedValidation = [
  body('name').notEmpty().withMessage('Feed name is required'),
  body('filters').optional().isObject(),
  body('sortBy').optional().isIn(['recent', 'popular', 'trending'])
];

const updateFeedValidation = [
  body('name').optional().notEmpty(),
  body('filters').optional().isObject(),
  body('sortBy').optional().isIn(['recent', 'popular', 'trending'])
];

// Routes
router.post('/', authMiddleware, createFeedValidation, createFeedPreferenceHandler);
router.get('/', authMiddleware, getUserPreferencesHandler);
router.get('/:preferenceId', authMiddleware, getCustomFeedHandler);
router.put('/:preferenceId', authMiddleware, updateFeedValidation, updateFeedPreferenceHandler);
router.delete('/:preferenceId', authMiddleware, deleteFeedPreferenceHandler);
router.get('/default', authMiddleware, getDefaultFeedHandler);
router.get('/search', authMiddleware, searchFeedHandler);
router.get('/trending/topics', authMiddleware, getTrendingTopicsHandler);
router.get('/trending/hashtags', authMiddleware, getTrendingHashtagsHandler);

module.exports = router;