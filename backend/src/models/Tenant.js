const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  room: { type: String }, // Can be roomId or room Number string for legacy
  rent: { type: Number },
  checkInDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'LEFT', 'PENDING'], 
    default: 'ACTIVE' 
  },
  rentStatus: { 
    type: String, 
    enum: ['PAID', 'PENDING'], 
    default: 'PENDING' 
  },
  messPlan: { 
    type: String, 
    enum: ['basic', 'standard', 'premium'], 
    default: 'basic' 
  },
  aadhaarNumber: { type: String },
  docs: [{
    name: String,
    url: String,
    verified: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);
