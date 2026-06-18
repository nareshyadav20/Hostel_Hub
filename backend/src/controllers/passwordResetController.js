/**
 * passwordResetController.js
 *
 * Implements the 3-step forgot-password flow:
 *
 *  1. POST /auth/forgot-password   { email }
 *     → Generates a 6-digit OTP + short-lived reset token, emails OTP to user.
 *
 *  2. POST /auth/verify-otp        { email, otp }
 *     → Validates the OTP, returns the resetToken (to be included in step 3).
 *
 *  3. POST /auth/reset-password    { resetToken, newPassword }
 *     → Validates the token, hashes the new password, updates the user.
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const emailService = require('../utils/emailService');

// ── 1. Forgot Password ─────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Always return 200 to prevent email enumeration attacks
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, an OTP has been sent.'
      });
    }

    // Invalidate any existing reset requests for this email
    await PasswordReset.deleteMany({ email: user.email });

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate a secure unique reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await PasswordReset.create({ email: user.email, otp, resetToken, expiresAt });

    // Send OTP via email (non-blocking — error is caught but not fatal)
    try {
      await emailService.sendPasswordResetOTP({
        to: user.email,
        name: user.name,
        otp
      });
    } catch (emailErr) {
      console.error('⚠️ [PASSWORD_RESET] Email failed but OTP saved:', emailErr.message);
      // In development, log the OTP to console as fallback
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔑 [DEV_OTP] ${user.email} → OTP: ${otp}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, an OTP has been sent.',
      // Expose OTP in non-production for easier testing (Postman / Flutter dev)
      ...(process.env.NODE_ENV !== 'production' && { devOtp: otp })
    });
  } catch (err) {
    console.error('❌ [PASSWORD_RESET] forgotPassword error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── 2. Verify OTP ──────────────────────────────────────────────────────────────
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const record = await PasswordReset.findOne({
      email: email.toLowerCase().trim(),
      otp,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
      resetToken: record.resetToken   // Client uses this in the next step
    });
  } catch (err) {
    console.error('❌ [PASSWORD_RESET] verifyOtp error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── 3. Reset Password ──────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const record = await PasswordReset.findOne({
      resetToken,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token. Please request a new OTP.'
      });
    }

    const user = await User.findOne({ email: record.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    // Mark the pre-save hook to NOT re-hash (password is already hashed)
    user.$__reset();          // reset Mongoose modified state
    await User.updateOne({ _id: user._id }, { $set: { password: user.password } });

    // Mark the reset record as used to prevent reuse
    await PasswordReset.findByIdAndUpdate(record._id, { $set: { used: true } });

    // Invalidate all other reset tokens for this user
    await PasswordReset.deleteMany({ email: record.email });

    return res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.'
    });
  } catch (err) {
    console.error('❌ [PASSWORD_RESET] resetPassword error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
