const mongoose = require('mongoose');

const roomTransferSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  oldRoom: { type: String, required: true },
  newRoom: { type: String, required: true },
  reason: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING'
  },
  requestDate: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'roomtransfers' });

module.exports = mongoose.model('RoomTransfer', roomTransferSchema);
