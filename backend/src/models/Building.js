const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  address:     { type: String, required: true },
  description: { type: String },
  startingPrice: { type: Number },
  genderType:    { type: String, enum: ['Boys', 'Girls', 'Mixed'], default: 'Mixed' },
  category:      { type: String, enum: ['Student', 'Professional', 'Mixed'], default: 'Mixed' },
  rating:        { type: Number, default: 4.5 },
  amenities:     [{ type: String }],
  policies:      {
    smoking: { type: String, default: 'Not Allowed' },
    alcohol: { type: String, default: 'Not Allowed' },
    visitors: { type: String, default: 'Allowed till 8 PM' }
  },
  images:        [{ type: String }],
  status:        { type: String, enum: ['Active', 'Draft', 'Inactive'], default: 'Active' },
  owner:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  floors:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Floor' }]
}, { timestamps: true, collection: 'owner_buildings' });

module.exports = mongoose.model('Building', buildingSchema);
