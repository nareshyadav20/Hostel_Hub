const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  requestedBy: { type: String, required: true },
  itemName: { type: String, required: true },
  category: { type: String },
  subCategory: { type: String },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'Units' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseRequest', purchaseRequestSchema);
