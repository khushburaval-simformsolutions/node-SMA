// src/routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, updateUserProfile } = require('../services/userService');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/userModel'); // Import the User model
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put(
  '/profile',
  authMiddleware,
  [
    body('username').optional().isString().withMessage('Username must be a string'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('profile.bio').optional().isString().withMessage('Bio must be a string'),
    body('profile.avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedUser = await updateUserProfile(req.user.id, req.body);
      res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;