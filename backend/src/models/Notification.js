const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  moduleName: { type: String, required: true }, // e.g., 'Payments', 'Inventory', 'Complaints'
  portalType: { type: String, enum: ['Tenant', 'Staff', 'Owner', 'All'], default: 'Owner' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  isRead: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: link to a specific user
  metadata: { type: mongoose.Schema.Types.Map, of: String } // For deep linking or extra data
}, { timestamps: true, collection: 'owner_notifications' });

module.exports = mongoose.model('Notification', notificationSchema);
