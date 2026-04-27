const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  address:     { type: String },
  description: { type: String },
  amenities:   [{ type: String }],
  images:      [{ type: String }],
  floors:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Floor' }]
}, { timestamps: true, collection: 'buildings' });

module.exports = mongoose.model('Building', buildingSchema);
