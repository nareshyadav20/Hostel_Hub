const mongoose = require('mongoose');

const roomTransferSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  oldRoom: { type: String, required: true },
  newRoom: { type: String, required: true },
  reason: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING'
  },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  requestDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('RoomTransfer', roomTransferSchema);
