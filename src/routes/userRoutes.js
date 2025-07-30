const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const { isValidEmail, isValidUsername } = require('../utils/validators');
const {
  registerHandler,
  loginHandler,
  getProfileHandler,
  updateProfileHandler
} = require('../controllers/userController');

const router = express.Router();

const registerValidation = [
  body('email').custom(email => {
    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    return true;
  }),
  body('username').custom(username => {
    if (!isValidUsername(username)) {
      throw new Error('Username must be 3-20 characters and contain only letters, numbers, and underscores');
    }
    return true;
  }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const updateProfileValidation = [
  body('email')
    .optional()
    .custom(email => {
      if (!isValidEmail(email)) {
        throw new Error('Invalid email format');
      }
      return true;
    }),
  body('username')
    .optional()
    .custom(username => {
      if (!isValidUsername(username)) {
        throw new Error('Username must be 3-20 characters and contain only letters, numbers, and underscores');
      }
      return true;
    })
];

router.post('/register', registerValidation, registerHandler);
router.post('/login', loginHandler);
router.get('/profile', authMiddleware, getProfileHandler);
router.put('/profile', authMiddleware, updateProfileValidation, updateProfileHandler);

module.exports = router;