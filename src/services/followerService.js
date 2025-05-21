
const Follower = require('../models/followerModel');

const followUser = async (followerId, followingId) => {
  if (followerId === followingId) throw new Error('You cannot follow yourself');
  return await Follower.create({ followerId, followingId });
};

const unfollowUser = async (followerId, followingId) => {
  const result = await Follower.findOneAndDelete({ followerId, followingId });
  if (!result) throw new Error('Follow relationship not found');
  return result;
};

const getFollowers = async (userId) => {
  return await Follower.find({ followingId: userId }).populate('followerId', 'username');
};

const getFollowings = async (userId) => {
  return await Follower.find({ followerId: userId }).populate('followingId', 'username');
};

module.exports = { followUser, unfollowUser, getFollowers, getFollowings };