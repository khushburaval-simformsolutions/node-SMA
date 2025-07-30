const { registerUser, loginUser, updateUserProfile } = require('../services/userService');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const registerHandler = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, { errors: errors.array() });
    }
    const user = await registerUser(req.body);
    return successResponse(res, user, 201);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    return successResponse(res, { user, token });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getProfileHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return successResponse(res, user);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const updateProfileHandler = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, { errors: errors.array() });
    }
    const updatedUser = await updateUserProfile(req.user.id, req.body);
    return successResponse(res, updatedUser);
  } catch (err) {
    return errorResponse(res, err);
  }
};

module.exports = {
  registerHandler,
  loginHandler,
  getProfileHandler,
  updateProfileHandler
};