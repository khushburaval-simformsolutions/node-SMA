require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/social-media-app',
  jwtSecret: process.env.JWT_SECRET || 'topSecret357',
  environment: process.env.NODE_ENV || 'development',
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_BUCKET_NAME
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  }
};