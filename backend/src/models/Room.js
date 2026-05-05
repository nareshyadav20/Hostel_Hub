const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  roomType:   { type: String, default: 'Single' },
  capacity:   { type: Number, default: 1 },
  rentAmount: { type: Number, default: 0 },
  status:     { type: String, default: 'AVAILABLE' },
  amenities:  [{ type: String }],
  images:     [{ type: String }],
  floor:      { type: mongoose.Schema.Types.ObjectId, ref: 'Floor' },
  beds:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bed' }]
}, { timestamps: true, collection: 'owner_rooms' });

module.exports = mongoose.model('Room', roomSchema);
