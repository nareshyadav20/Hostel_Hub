const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostelId: { type: String, required: true },
  // Adding snapshot data for quick UI rendering
  hostelName: String,
  hostelLocation: String,
  hostelPrice: Number,
  hostelImage: String,
  hostelRating: Number,
  gender: String,
  type: String
}, { timestamps: true });

// Ensure a user can only have a specific hostel once in their wishlist
wishlistSchema.index({ user: 1, hostelId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
