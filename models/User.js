// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['buyer', 'administrator'], default: 'buyer' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
