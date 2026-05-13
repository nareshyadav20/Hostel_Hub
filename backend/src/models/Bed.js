const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true },
  status:    { type: String, enum: ['AVAILABLE','OCCUPIED','MAINTENANCE','RESERVED'], default: 'AVAILABLE' },
  position:  { type: String, default: 'Standard' }, // e.g. Window side, Entrance side, Middle
  bedType:   { type: String, default: 'Single' },   // e.g. Lower Bunk, Upper Bunk, Single, Queen
  comfortScore: { type: Number, default: 4.5 },
  privacyScore: { type: Number, default: 4.5 },
  chargingPorts: { type: Boolean, default: true },
  lockerAvailability: { type: Boolean, default: true },
  smartLockSupport: { type: Boolean, default: false },
  hygieneTracking: { type: String, default: 'Daily' },
  images:    [{ type: String }],
  tenant:    { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  room:      { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }
}, { timestamps: true, collection: 'owner_beds' });

module.exports = mongoose.model('Bed', bedSchema);
