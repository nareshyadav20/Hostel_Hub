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
  }
}, { timestamps: true, collection: 'hostels' });

module.exports = mongoose.model('Hostel', hostelSchema);
