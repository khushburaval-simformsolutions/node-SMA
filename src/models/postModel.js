const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  mediaUrl: String,
  mediaType: {
    type: String,
    enum: ['image', 'video', null],
    default: null
  },
  topics: [String],
  hashtags: [String],
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  comments: [commentSchema],
  trendingScore: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Update trending score before saving
postSchema.pre('save', function(next) {
  const hoursAge = (Date.now() - this.createdAt) / (1000 * 60 * 60);
  this.trendingScore = (this.likesCount + this.comments.length) / (hoursAge + 1);
  next();
});
module.exports = mongoose.model('Post', postSchema);