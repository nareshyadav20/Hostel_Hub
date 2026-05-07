const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  userId: { type: String },
  category: { type: String, required: true },
  moveInDate: { type: String, default: 'TBD' },
  securityDeposit: { type: Number, default: 0 },
  onboardingFee: { type: Number, default: 2000 },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Cancelled'], 
    default: 'Confirmed' 
  },
  paymentMethod: { type: String, default: 'UPI' },
  transactionId: { type: String },
  bookingDate: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'bookings' });

module.exports = mongoose.model('Booking', bookingSchema);
