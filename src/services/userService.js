// src/services/userService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const registerUser = async (userData) => {
  const { username, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  return await user.save();
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  return { user, token };
};

const updateUserProfile = async (userId, profileData) => {
  const { username, email, profile } = profileData;

  const updateFields = {};
  if (username) updateFields.username = username;
  if (email) updateFields.email = email;
  if (profile) updateFields.profile = profile;

  const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select('-password');
  if (!updatedUser) throw new Error('User not found');
  return updatedUser;
};

module.exports = { registerUser, loginUser, updateUserProfile };