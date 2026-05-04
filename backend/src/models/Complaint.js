const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Maintenance', 'Housekeeping', 'WiFi / IT', 'Leave', 'Visitor', 'Other'],
    default: 'Maintenance'
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Resolved', 'In Progress'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  bedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
