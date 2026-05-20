const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  assetName: { type: String, required: true },
  subIssues: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Ensure unique asset name per building
assetSchema.index({ buildingId: 1, assetName: 1 }, { unique: true });

module.exports = mongoose.model('Asset', assetSchema);
