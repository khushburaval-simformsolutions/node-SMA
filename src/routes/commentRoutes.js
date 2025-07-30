const express = require('express');
const router = express.Router();
const { addCommentHandler, getCommentsHandler } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Add comment to post
router.post('/:postId', authMiddleware, addCommentHandler);

// Get post comments with pagination
router.get('/:postId', getCommentsHandler);

module.exports = router;