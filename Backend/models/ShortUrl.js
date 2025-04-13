const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
  userId: String,
  originalUrl: String,
  shortCode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  expirationDate: Date,
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);
