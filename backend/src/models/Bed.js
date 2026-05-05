const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true },
  status:    { type: String, enum: ['AVAILABLE','OCCUPIED','MAINTENANCE','RESERVED'], default: 'AVAILABLE' },
  images:    [{ type: String }],
  tenant:    { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  room:      { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }
}, { timestamps: true, collection: 'owner_beds' });

module.exports = mongoose.model('Bed', bedSchema);
