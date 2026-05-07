const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  floorNumber: { type: String, required: true },
  description: { type: String },
  images:      [{ type: String }],
  building:    { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  rooms:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }]
}, { timestamps: true, collection: 'owner_floors' });

module.exports = mongoose.model('Floor', floorSchema);
