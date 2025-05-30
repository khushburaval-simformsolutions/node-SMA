const express = require('express');
const mongoose = require('mongoose');
const redis = require('../services/cacheService').redis;

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Check Redis connection
    const redisStatus = redis.status === 'ready' ? 'connected' : 'disconnected';

    res.json({
      status: 'healthy',
      timestamp: new Date(),
      services: {
        database: dbStatus,
        cache: redisStatus
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

module.exports = router;