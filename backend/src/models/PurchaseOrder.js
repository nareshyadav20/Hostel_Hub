const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true },
  vendorName: { type: String, required: true },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  deliveryStatus: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
  expectedDelivery: { type: Date },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
