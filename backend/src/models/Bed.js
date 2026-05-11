const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true },
  status:    { type: String, enum: ['AVAILABLE','OCCUPIED','MAINTENANCE','RESERVED'], default: 'AVAILABLE' },
  position:  { type: String, default: 'Standard' }, // e.g. Window side, Entrance side, Middle
  bedType:   { type: String, default: 'Single' },   // e.g. Lower Bunk, Upper Bunk, Single, Queen
  images:    [{ type: String }],
  comfortScore:  { type: Number, default: 8.5 },
  specs: {
    mattress:    { type: String, default: 'Memory Foam' },
    capacityWeight: { type: String, default: '180kg' },
    material:    { type: String, default: 'Teak Wood' }
  },
  smartFeatures: {
    hasReadingLight: { type: Boolean, default: true },
    hasUSBPort:      { type: Boolean, default: true },
    hasFastWiFi:     { type: Boolean, default: true },
    hasPersonalLocker: { type: Boolean, default: true }
  },
  hygieneSeal: {
    lastSanitized: { type: Date, default: Date.now }
  },
  tenant:    { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  room:      { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }
}, { timestamps: true, collection: 'owner_beds' });

module.exports = mongoose.model('Bed', bedSchema);
