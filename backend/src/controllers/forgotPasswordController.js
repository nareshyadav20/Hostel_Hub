const User = require('../models/User');
const ForgotPassword = require('../models/ForgotPassword');

/**
 * POST /api/auth/forgot-password
 * Body: { email, newPassword }
 *
 * Flow:
 *  1. Validate the email exists in the users collection
 *  2. Set the plain-text password on the user document
 *     → The User model's pre('save') hook auto-hashes it with bcrypt (10 rounds)
 *     → This avoids double-hashing
 *  3. Save the user — hook fires and stores a proper bcrypt hash
 *  4. Log the reset in the `forgot_password` collection (stores the final hash)
 *  5. Return success
 */
const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    // 1. Find the user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    // 2. Set plain-text password — the User pre-save hook will hash it automatically
    //    DO NOT pre-hash here; that would cause double-hashing and break login.
    user.password = newPassword;

    // 3. Save — hook fires: password gets bcrypt-hashed
    await user.save();

    console.log(`✅ [FORGOT_PASSWORD] Password updated for: ${email}`);

    // 4. Log the reset to the forgot_password collection
    //    user.password is now the final bcrypt hash (post-save)
    const resetRecord = await ForgotPassword.create({
      email: email.toLowerCase().trim(),
      hashedPassword: user.password,   // store the bcrypt hash, not plain text
      status: 'completed',
      ipAddress: req.ip || req.headers['x-forwarded-for'] || null,
      userAgent: req.headers['user-agent'] || null,
      completedAt: new Date(),
    });

    console.log(`📝 [FORGOT_PASSWORD] Reset record saved: ${resetRecord._id}`);

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (err) {
    console.error('❌ [FORGOT_PASSWORD] Error:', err.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again.', error: err.message });
  }
};

/**
 * GET /api/auth/forgot-password/history
 * Returns all reset records (admin/debug — never exposes hashed passwords)
 */
const getForgotPasswordHistory = async (req, res) => {
  try {
    const records = await ForgotPassword.find({})
      .select('-hashedPassword')
      .sort({ createdAt: -1 })
      .limit(100);
    return res.status(200).json({ success: true, count: records.length, records });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
};

module.exports = { forgotPassword, getForgotPasswordHistory };

