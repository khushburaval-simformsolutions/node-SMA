
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { followUserHandler, unfollowUserHandler, getFollowersHandler, getFollowingsHandler } = require('../controllers/followerController');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const router = express.Router();

router.post('/follow/:id', authMiddleware, async (req, res) => {
  try {
    const result = await followUser(req.user.id, req.params.id);
    return successResponse(res, result, 201);
  } catch (err) {
    return errorResponse(res, err);
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
    const followers = await getFollowers(req.params.id);
    return successResponse(res, followers);
  } catch (err) {
    return errorResponse(res, err);
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