const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Paid', 'Pending', 'Due', 'Overdue', 'Refunded', 'Success'],
    default: 'Paid'
  },
  date: { type: Date, default: Date.now },
  month: { type: String }, // e.g. "May 2026"
  type: { 
    type: String, 
    enum: ['Rent', 'Mess', 'Deposit', 'Refund', 'Booking'],
    default: 'Rent'
  },
  category: { type: String, default: 'Standard' }, // e.g. 'Single', 'Shared', 'Double'
  invoice: { type: String, unique: true },
  method: { 
    type: String, 
    enum: ['UPI', 'Cash', 'Bank Transfer'],
    default: 'UPI'
  },
  transactionId: { type: String }
}, { timestamps: true, collection: 'owner_payments' });

module.exports = mongoose.model('Payment', paymentSchema);
