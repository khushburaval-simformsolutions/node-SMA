
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { followUserHandler, unfollowUserHandler, getFollowersHandler, getFollowingsHandler } = require('../controllers/followerController');

const router = express.Router();

router.post('/follow/:id', authMiddleware, async (req, res) => {
  try {
    await followUserHandler(req, res);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/unfollow/:id', authMiddleware, async (req, res) => {
  try {
    await unfollowUserHandler(req, res);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id/followers', authMiddleware, async (req, res) => {
  try {
    await getFollowersHandler(req, res);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id/followings', authMiddleware, async (req, res) => {
  try {
    await getFollowingsHandler(req, res);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;