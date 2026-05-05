const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  emergencyContact: { type: String },
  room: { type: String },
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
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true, collection: 'tenants' });

module.exports = mongoose.model('Tenant', tenantSchema);
