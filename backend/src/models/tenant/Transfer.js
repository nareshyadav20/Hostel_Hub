const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  name: { type: String, required: true },
  oldRoom: { type: String, required: true },
  newRoom: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'roomtransfers' });

module.exports = mongoose.model('Transfer', transferSchema);
