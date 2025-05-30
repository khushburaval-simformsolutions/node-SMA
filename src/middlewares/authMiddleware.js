// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const config = require('../config/config');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    logger.warn('Access attempt without token', {
      path: req.path,
      ip: req.ip
    });
    return res.status(401).send('Access Denied');
  }

  try {
    const verified = jwt.verify(token, config.jwtSecret);
    req.user = verified;
    next();
  } catch (err) {
    logger.error('Auth middleware error', {
      path: req.path,
      error: error.message
    });
    res.status(400).send('Invalid Token');
  }
};

module.exports = authMiddleware;