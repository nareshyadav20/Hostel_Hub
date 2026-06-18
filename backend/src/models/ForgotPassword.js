const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Hashed new password (stored temporarily until confirmed)
    hashedPassword: {
      type: String,
      required: true,
    },
    // 'pending' → reset requested, 'completed' → password updated successfully
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,           // adds createdAt + updatedAt
    collection: 'forgot_password', // ← exact collection name as requested
  }
);

// Auto-expire old records after 30 days (optional housekeeping)
forgotPasswordSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);
