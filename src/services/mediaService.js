const AWS = require('aws-sdk');
const config = require('../config/config');
const { addJob } = require('./queueService');

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

class MediaService {
  async uploadMedia(file, type) {
    const key = `${type}/${Date.now()}-${file.originalname}`;
    
    await s3.upload({
      Bucket: config.aws.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    }).promise();

    // Queue media processing job
    await addJob('mediaProcessing', {
      key,
      type,
      originalName: file.originalname
    });

    return `https://${config.aws.bucket}.s3.amazonaws.com/${key}`;
  }
}

module.exports = new MediaService();