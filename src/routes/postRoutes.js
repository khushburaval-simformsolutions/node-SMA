const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const { createPost, getPosts, updatePost, deletePost, generateFeed } = require('../services/postService');
const { getPostByIdHandler, getUserPostsHandler } = require('../controllers/postController');

const router = express.Router();

router.post('/', 
  authMiddleware,
  [
    body('content').notEmpty().withMessage('Content is required'),
    body('mediaUrl').optional().isURL()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content, mediaUrl } = req.body;
      const post = await createPost(req.user.id, content, mediaUrl);
      
      res.status(201).json(post);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/user/posts', authMiddleware, async (req, res) => {
  try {
    await getUserPostsHandler(req, res);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/feed', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const feed = await generateFeed(req.user.id, page, limit);
    res.json(feed);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put(
  '/:id',
  authMiddleware,
  [body('content').notEmpty().withMessage('Content is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await updatePost(req.params.id, req.user.id, req.body.content);
      res.json(post);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    await getPostByIdHandler(req, res);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await deletePost(req.params.id, req.user.id);
    res.json({ message: 'Post deleted successfully', post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;