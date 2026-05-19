const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: 'Emergency',
    },
    message: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved'],
      default: 'Active',
    },
    reportedBy: {
      type: String,
      required: true,
    },
    buildingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
      required: false,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  },
  {
    timestamps: true,
    collection: 'SOSAlerts',
  }
);

module.exports = mongoose.models.SOSAlert || mongoose.model('SOSAlert', sosAlertSchema);
