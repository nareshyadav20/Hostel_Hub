const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  moduleName: { type: String, required: true }, // e.g. 'Payments', 'Inventory'
  portalType: { type: String, enum: ['Tenant', 'Staff', 'Owner'], required: true },
  category: { type: String, required: true }, // e.g. 'Rent', 'Maintenance'
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  
  // IDs for Context
  buildingId: { type: String, required: true },
  roomId: { type: String },
  tenantId: { type: String },
  staffId: { type: String },
  hostelId: { type: String },
  
  // Status
  isRead: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  createdBy: { type: String }, // User ID or system
  
  // Actions (Optional but helpful)
  actionLink: { type: String }, 
}, { timestamps: true, collection: 'owner_notifications' });

module.exports = mongoose.model('Notification', notificationSchema);
