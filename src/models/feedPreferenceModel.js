const mongoose = require('mongoose');

const feedPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  filters: {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    topics: [String],
    mediaOnly: { type: Boolean, default: false },
    excludedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  sortBy: {
    type: String,
    enum: ['recent', 'popular', 'trending'],
    default: 'recent'
  }
}, { timestamps: true });

// Ensure each user can only have one feed preference with the same name
feedPreferenceSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('FeedPreference', feedPreferenceSchema);