const mongoose = require('mongoose');

const messLogSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  tenantName: { type: String, required: true },
  roomNumber: { type: String },
  meal: { type: String, required: true }, // Breakfast, Lunch, Dinner
  status: { type: Boolean, required: true }, // true for attending, false for skipping
  date: { type: Date, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'mess_logs' });

module.exports = mongoose.model('MessLog', messLogSchema);
