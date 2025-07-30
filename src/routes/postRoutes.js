const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const { createPostHandler, getPostsHandler, updatePostHandler, deletePostHandler, getPostByIdHandler, getUserPostsHandler } = require('../controllers/postController');
const { isValidMediaUrl } = require('../utils/mediaHandler');

const router = express.Router();

// Validation middleware
const createPostValidation = [
  body('content').notEmpty().withMessage('Content is required'),
  body('mediaUrl')
    .optional()
    .custom((value) => {
      if (value && !isValidMediaUrl(value)) {
        throw new Error('Invalid media URL');
      }
      return true;
    })
];

const updatePostValidation = [
  body('content').notEmpty().withMessage('Content is required')
];

// Routes
router.post('/', authMiddleware, createPostValidation, createPostHandler);

router.get('/', authMiddleware, getPostsHandler);

router.put('/:id', authMiddleware, updatePostValidation, updatePostHandler);

router.delete('/:id', authMiddleware, deletePostHandler);

router.get('/:id', authMiddleware, getPostByIdHandler);

router.get('/user/:id', authMiddleware, getUserPostsHandler);

module.exports = router;