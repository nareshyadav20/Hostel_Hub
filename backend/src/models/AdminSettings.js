const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
  twoFactor: { type: Boolean, default: true },
  sessionPersistence: { type: Boolean, default: false },
  smtpEmailRelay: { type: Boolean, default: true },
  smsGateway: { type: Boolean, default: true },
  webPush: { type: Boolean, default: false },
  paymentOverdue: { type: Boolean, default: true },
  highPriorityIssues: { type: Boolean, default: true },
  staffDailyDigest: { type: Boolean, default: false },
  platformPersona: { type: String, default: "StayNest Enterprise Hub" },
  adminEmail: { type: String, default: "ops@staynest.com" },
  fiscalUnit: { type: String, default: "INR (₹) - Indian Rupee" },
  operationalLanguage: { type: String, default: "English (Universal)" },
  invoicingPrefix: { type: String, default: "LIV-" },
  taxPercentage: { type: String, default: "18%" }
}, { timestamps: true, collection: 'admin_settings' });

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);
