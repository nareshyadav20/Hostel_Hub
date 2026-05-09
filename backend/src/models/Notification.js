const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
  category: { type: String, enum: ['all', 'staff', 'system'], default: 'all' },
  read: { type: Boolean, default: false },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  target: { type: String, default: 'All Tenants' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
