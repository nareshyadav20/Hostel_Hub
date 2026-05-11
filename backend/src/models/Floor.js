const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  floorNumber: { type: String, required: true },
  description: { type: String },
  images:      [{ type: String }],
  hygieneScore:     { type: Number, default: 96 },
  occupancyHeatmap: { type: Number, default: 78 },
  aiInsights:       { type: String, default: 'High natural light detected on East wing. Recommended for study zones.' },
  floorType:        { type: String, default: 'Mixed Residency' },
  liveFacilities:   [{ type: String, default: ['Laundry', 'Smart Access', 'Pantry', 'Gaming Zone', 'Study Hall'] }],
  building:    { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  rooms:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }]
}, { timestamps: true, collection: 'owner_floors' });

module.exports = mongoose.model('Floor', floorSchema);
