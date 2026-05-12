const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  floorNumber: { type: String, required: true },
  description: { type: String },
  images:      [{ type: String }],
  buildingId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  rooms:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],

  // Floor Specialization (Step 7)
  floorCategory: { 
    type: String, 
    enum: ['General', 'Female-only', 'Silent study', 'Premium', 'Working professional'], 
    default: 'General' 
  },

  // Floor Hygiene Tracking (Step 14)
  hygieneRating: { type: Number, default: 5.0 }
}, { timestamps: true, collection: 'owner_floors' });

module.exports = mongoose.model('Floor', floorSchema);
