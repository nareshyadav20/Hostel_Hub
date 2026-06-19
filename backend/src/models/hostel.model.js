const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, required: true },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'BOTH'], required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  images: [{ type: String }],
  amenities: [{ type: String }],
  availableBeds: { type: Number, default: 0 }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Using a unique collection name to avoid conflicts with existing Hostel models
module.exports = mongoose.model('HostelListing', hostelSchema);
