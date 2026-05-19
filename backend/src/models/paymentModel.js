const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Could be User or Tenant depending on auth logic, assuming User or Tenant based on prompt
    required: true
  },
  buildingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building'
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner' // Assuming Owner model exists
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['PhonePe', 'UPI', 'Debit Card', 'Credit Card', 'Net Banking', 'Cash'],
    default: 'UPI'
  },
  transactionId: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Success', 'Failed'],
    default: 'Success'
  },
  paymentType: {
    type: String,
    enum: ['Booking', 'Rent', 'Deposit'],
    default: 'Booking'
  },
  paidAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
