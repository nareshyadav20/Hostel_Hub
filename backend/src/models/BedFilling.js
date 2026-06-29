const mongoose = require('mongoose');

const bedFillingSchema = new mongoose.Schema({
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  category: { type: String, required: true },
  sharingType: { type: Number, required: true },
  bedNumber: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Occupied'], default: 'Occupied' },
  bookingDate: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'bed_filling' });

module.exports = mongoose.model('BedFilling', bedFillingSchema);
