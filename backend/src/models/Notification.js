const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  moduleName: { type: String, required: false }, // e.g. 'Payments', 'Inventory'
  portalType: { type: String, enum: ['Tenant', 'Staff', 'Owner', 'All'], required: false },
  category: { type: String, required: false }, // e.g. 'Rent', 'Maintenance'
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  type: { type: String, default: 'info' },
  
  // Target Targeting
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: String }, // Can be userId, tenantId, or buildingId
  receiverRole: { type: String, enum: ['Tenant', 'Staff', 'Owner', 'All'], default: 'All' },
  
  // IDs for Context (Keeping for compatibility)
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: false },
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
  
  // Actions
  actionLink: { type: String }, 
}, { timestamps: true, collection: 'notifications' });

module.exports = mongoose.model('Notification', notificationSchema);
