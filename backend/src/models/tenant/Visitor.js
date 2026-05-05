const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Cancelled'],
    default: 'Approved'
  },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true, collection: 'visitors' });

module.exports = mongoose.model('Visitor', visitorSchema);
