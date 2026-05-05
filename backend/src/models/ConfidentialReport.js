const mongoose = require('mongoose');

const confidentialReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    classification: {
      type: String,
      default: 'Other Concern',
    },
    location: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    submittedBy: {
      type: String,
      default: 'Tenant',
    },
  },
  {
    timestamps: true,
    collection: 'ConfidentialReporting',
  }
);

module.exports = mongoose.model('ConfidentialReport', confidentialReportSchema);
