const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  moduleName: { type: String, required: true }, // e.g. 'Payments', 'Inventory'
  portalType: { type: String, enum: ['Tenant', 'Staff', 'Owner', 'All'], required: true },
  category: { type: String, required: true }, // e.g. 'Rent', 'Maintenance'
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
  
  // IDs for Context
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  roomId: { type: String },
  tenantId: { type: String },
  staffId: { type: String },
  hostelId: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  target: { type: String, default: 'All Tenants' },
  
  // Status
  isRead: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  createdBy: { type: String }, // User ID or system
  automatedId: { type: String, unique: true, sparse: true }, // For duplicate prevention in scheduling
  
  // Actions
  actionLink: { type: String }, 
}, { timestamps: true, collection: 'notifications' });

module.exports = mongoose.model('Notification', notificationSchema);
