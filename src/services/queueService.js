const Bull = require('bull');
const config = require('../config/config');
const logger = require('../utils/logger');

const queues = {
  notifications: new Bull('notifications', config.redis.url),
  mediaProcessing: new Bull('mediaProcessing', config.redis.url),
  storyCleanup: new Bull('storyCleanup', config.redis.url)
};

const addJob = async (queueName, data, options = {}) => {
  try {
    const queue = queues[queueName];
    if (!queue) throw new Error(`Queue ${queueName} not found`);
    await queue.add(data, options);
  } catch (error) {
    logger.error('Queue error:', error);
    throw error;
  }
};

module.exports = { queues, addJob };