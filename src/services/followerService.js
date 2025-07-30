
const Follower = require('../models/followerModel');
const { paginateResults, createPaginationResponse } = require('../utils/pagination');

const followUser = async (followerId, followingId) => {
  if (followerId === followingId) throw new Error('You cannot follow yourself');
  return await Follower.create({ followerId, followingId });
};

const unfollowUser = async (followerId, followingId) => {
  const result = await Follower.findOneAndDelete({ followerId, followingId });
  if (!result) throw new Error('Follow relationship not found');
  return result;
};

const getFollowers = async (userId, page = 1, limit = 10) => {
  const { skip, limit: limitParsed } = paginateResults(page, limit);

  const followers = await Follower.find({ followingId: userId })
    .populate('followerId', 'username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitParsed);

  const total = await Follower.countDocuments({ followingId: userId });

  return createPaginationResponse(followers, total, page, limit);
};

const getFollowings = async (userId, page = 1, limit = 10) => {
  const { skip, limit: limitParsed } = paginateResults(page, limit);

  const followings = await Follower.find({ followerId: userId })
    .populate('followingId', 'username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitParsed);

  const total = await Follower.countDocuments({ followerId: userId });

  return createPaginationResponse(followings, total, page, limit);
};

module.exports = { followUser, unfollowUser, getFollowers, getFollowings };