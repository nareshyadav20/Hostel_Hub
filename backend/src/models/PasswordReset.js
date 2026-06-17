const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  email:     { type: String, required: true, index: true },
  otp:       { type: String, required: true },       // 6-digit OTP
  resetToken:{ type: String, required: true, unique: true }, // JWT-like token for /reset-password
  expiresAt: { type: Date,   required: true },       // TTL – 15 minutes
  used:      { type: Boolean, default: false }
}, { timestamps: true, collection: 'password_resets' });

// Auto-delete expired documents
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
