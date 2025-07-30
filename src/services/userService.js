const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { isValidEmail, isValidUsername } = require('../utils/validators');
const config = require('../config/config');

const registerUser = async (userData) => {
  const { username, email, password } = userData;
  
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
  
  if (!isValidUsername(username)) {
    throw new Error('Username must be 3-20 characters and contain only letters, numbers, and underscores');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  return await user.save();
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
  return { user, token };
};

const updateUserProfile = async (userId, profileData) => {
  const { username, email, profile } = profileData;

  if (email && !isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (username && !isValidUsername(username)) {
    throw new Error('Invalid username format');
  }

  const updateFields = {};
  if (username) updateFields.username = username;
  if (email) updateFields.email = email;
  if (profile) updateFields.profile = profile;

  const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select('-password');
  if (!updatedUser) throw new Error('User not found');
  return updatedUser;
};

module.exports = { registerUser, loginUser, updateUserProfile };