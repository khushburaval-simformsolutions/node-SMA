const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { 
  followUserHandler, 
  unfollowUserHandler, 
  getFollowersHandler, 
  getFollowingsHandler 
} = require('../controllers/followerController');

// Follow a user
router.post('/follow/:id', authMiddleware, followUserHandler);

// Unfollow a user
router.delete('/unfollow/:id', authMiddleware, unfollowUserHandler);

// Get user's followers
router.get('/:id/followers', authMiddleware, getFollowersHandler);

// Get user's followings
router.get('/:id/followings', authMiddleware, getFollowingsHandler);

module.exports = router;