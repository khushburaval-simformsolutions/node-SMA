
const { followUser, unfollowUser, getFollowers, getFollowings } = require('../services/followerService');

const followUserHandler = async (req, res) => {
  try {
    const result = await followUser(req.user.id, req.params.id);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const unfollowUserHandler = async (req, res) => {
  try {
    const result = await unfollowUser(req.user.id, req.params.id);
    res.json({ message: 'Unfollowed successfully', result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getFollowersHandler = async (req, res) => {
  try {
    const followers = await getFollowers(req.params.id);
    res.json(followers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getFollowingsHandler = async (req, res) => {
  try {
    const followings = await getFollowings(req.params.id);
    res.json(followings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { followUserHandler, unfollowUserHandler, getFollowersHandler, getFollowingsHandler };