// src/utils/hashtagExtractor.js
const extractHashtags = (content) => {
  const hashtags = (content.match(/#[\w]+/g) || [])
    .map(tag => tag.substring(1).toLowerCase());
  return [...new Set(hashtags)];
};

const extractTopics = (content) => {
  const words = content.split(/\s+/)
    .filter(word => word.length > 3)
    .map(word => word.toLowerCase());
  return [...new Set(words)];
};

module.exports = {
  extractHashtags,
  extractTopics
};