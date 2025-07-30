const { followUser, unfollowUser, getFollowers, getFollowings } = require('../services/followerService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const followUserHandler = async (req, res) => {
  try {
    const result = await followUser(req.user.id, req.params.id);
    return successResponse(res, { 
      message: 'Followed successfully', 
      result 
    }, 201);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const unfollowUserHandler = async (req, res) => {
  try {
    const result = await unfollowUser(req.user.id, req.params.id);
    return successResponse(res, { 
      message: 'Unfollowed successfully', 
      result 
    });
  } catch (err) {
    return errorResponse(res, err);
  }
};
const getFollowersHandler = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const followers = await getFollowers(
      req.params.id, 
      page, 
      limit
    );
    return successResponse(res, followers);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getFollowingsHandler = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const followings = await getFollowings(
      req.params.id, 
      page, 
      limit
    );
    return successResponse(res, followings);
  } catch (err) {
    return errorResponse(res, err);
  }
};

module.exports = {
  followUserHandler,
  unfollowUserHandler,
  getFollowersHandler,
  getFollowingsHandler
};