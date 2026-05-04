const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  address:     { type: String },
  locationCity: { type: String, default: 'Bengaluru' },
  description: { type: String },
  amenities:   [{ type: String }],
  images:      [{ type: String }],
  startingPrice: { type: Number, default: 5000 },
  genderType:  { type: String, enum: ['Boys', 'Girls', 'Mixed'], default: 'Mixed' },
  category:    { type: String, enum: ['Student', 'Professional', 'Luxury'], default: 'Student' },
  rating:      { type: Number, default: 4.5 },
  popularityLabel: { type: String },
  policies: {
    smoking: { type: String, default: 'Not Allowed' },
    alcohol: { type: String, default: 'Not Allowed' },
    pets: { type: String, default: 'No' },
    visitors: { type: String, default: 'Till 8 PM' }
  },
  staffInfo: {
    name: { type: String },
    role: { type: String },
    contact: { type: String }
  },
  status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
  lastStep: { type: Number, default: 1 },
  draftData: { type: mongoose.Schema.Types.Mixed },
  floors:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Floor' }]
}, { timestamps: true, collection: 'buildings' });

module.exports = mongoose.model('Building', buildingSchema);
