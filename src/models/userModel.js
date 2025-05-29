// src/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: isValidUsername,
      message: 'Invalid username format'
    }
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: isValidEmail,
      message: 'Invalid email format'
    }
  },
  password: { type: String, required: true },
  profile: {
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);