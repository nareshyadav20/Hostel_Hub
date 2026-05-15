const mongoose = require('mongoose');

const tenantProofSchema = new mongoose.Schema({
  tenantId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buildingId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  bookingId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  idProofUrl:  { type: String, required: true },          // Aadhaar / PAN file path
  photoUrl:    { type: String },                           // Profile photograph path
  uploadedAt:  { type: Date, default: Date.now },
  status:      { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }
}, { timestamps: true, collection: 'tenant_proof' });

module.exports = mongoose.model('TenantProof', tenantProofSchema);
