const mongoose = require('mongoose');

const communityReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Lost', 'Found'], required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('CommunityReport', communityReportSchema);
