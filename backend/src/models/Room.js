const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  roomType:   { type: String, default: 'Single' },
  capacity:   { type: Number, default: 1 },
  rentAmount: { type: Number, default: 0 },
  securityDeposit: { type: Number, default: 0 },
  noticePeriod: { type: Number, default: 30 }, // in days
  status:     { type: String, default: 'AVAILABLE' },
  isAC:       { type: Boolean, default: false },
  washroomType: { type: String, enum: ['Attached', 'Common'], default: 'Attached' },
  balcony:    { type: Boolean, default: false },
  facing:     { type: String, default: 'Road' },
  floorType:  { type: String, default: 'Tiles' }, // Marble, Tiles, Wooden
  windowCount: { type: Number, default: 1 },
  furniture:  [{ type: String }], // Bed, Table, Cupboard, Mirror
  amenities:  [{ type: String }],
  images:     [{ type: String }],
  aiInsight:      { type: String, default: 'Best for students: High natural light score.' },
  hygieneIndex:   { type: Number, default: 98 },
  comfortScore:   { type: Number, default: 92 },
  area:           { type: String, default: '240 sqft' },
  views:          { type: String, default: 'Garden' },
  privacyLevel:   { type: String, default: 'High' },
  smartFeatures: {
    hasSmartLock: { type: Boolean, default: true },
    hasRFID:      { type: Boolean, default: true },
    hasAirFlow:   { type: Boolean, default: true }
  },
  floor:      { type: mongoose.Schema.Types.ObjectId, ref: 'Floor' },
  beds:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bed' }]
}, { timestamps: true, collection: 'owner_rooms' });

module.exports = mongoose.model('Room', roomSchema);
