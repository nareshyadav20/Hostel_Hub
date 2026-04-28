const mongoose = require('mongoose');

const laundrySchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['Picked', 'Washing', 'Ironing', 'Ready', 'Delivered'],
    default: 'Picked'
  },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickupDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  items: [{
    name: String,
    count: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Laundry', laundrySchema);
