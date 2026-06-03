const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buildings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Building' }],
  staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subscription: {
    plan: { type: String, enum: ['BASIC', 'PREMIUM', 'ENTERPRISE'], default: 'BASIC' },
    status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], default: 'ACTIVE' },
    validUntil: { type: Date }
  },
  totalBeds: { type: Number, default: 0 },
  filledBeds: { type: Number, default: 0 },
  
  // Detailed Property Info
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  ownerDetails: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' }
  },
  images: [{ type: String }],
  documents: [{ type: String }],

  // Property Facilities
  hasSecurity: { type: Boolean, default: false },
  hasCCTV: { type: Boolean, default: false },
  hasParking: { type: Boolean, default: false },
  hasPowerBackup: { type: Boolean, default: false },
  hasMess: { type: Boolean, default: false },
  hasGym: { type: Boolean, default: false },
  hasLibrary: { type: Boolean, default: false },
  hasLaundry: { type: Boolean, default: false },
  hasHousekeeping: { type: Boolean, default: false },
  hasMedicalSupport: { type: Boolean, default: false }
}, { timestamps: true, collection: 'hostels' });

module.exports = mongoose.model('Hostel', hostelSchema);
