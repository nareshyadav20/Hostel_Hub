/**
 * profileController.js
 *
 * Tenant profile GET & PUT for the Flutter mobile app.
 * PUT enforces field-level restrictions: email and mobileNumber
 * cannot be changed through this endpoint.
 */

const Tenant  = require('../models/Tenant');
const User    = require('../models/User');

// Editable fields allowed by the spec
const ALLOWED_FIELDS = ['name', 'profileImage', 'gender', 'address', 'dateOfBirth'];

// Fields that must never be updated via this endpoint
const BLOCKED_FIELDS = ['email', 'mobileNumber', 'phone'];

/**
 * GET /api/profile
 * Returns the authenticated user's tenant profile.
 */
exports.getProfile = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ email: req.user.email })
      .select('-__v')
      .lean();

    if (!tenant) {
      // Fallback: return bare user info if no Tenant profile exists yet
      const user = await User.findById(req.user.id).select('name email phone role').lean();
      if (!user) return res.status(404).json({ success: false, message: 'Profile not found' });
      return res.status(200).json({ success: true, data: user });
    }

    return res.status(200).json({ success: true, data: tenant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/profile
 * Updates only the allowed fields.
 * Rejects requests that attempt to change email or mobileNumber.
 */
exports.updateProfile = async (req, res) => {
  try {
    const body = req.body || {};

    // Check for any blocked fields in the request body
    const attempted = BLOCKED_FIELDS.filter(f => Object.prototype.hasOwnProperty.call(body, f));
    if (attempted.length > 0) {
      // Return a user-friendly message for the first blocked field
      const fieldLabel =
        attempted[0] === 'email'        ? 'Email' :
        attempted[0] === 'mobileNumber' ? 'Mobile number' :
                                          'Phone';
      return res.status(400).json({
        success: false,
        message: `${fieldLabel} update is not allowed.`
      });
    }

    // Build a safe update object with only allowed fields
    const update = {};
    ALLOWED_FIELDS.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        update[field] = body[field];
      }
    });

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update. Allowed: ' + ALLOWED_FIELDS.join(', ')
      });
    }

    // Upsert — creates a minimal record if none exists
    const tenant = await Tenant.findOneAndUpdate(
      { email: req.user.email },
      { $set: update },
      { new: true, runValidators: true }
    ).select('-__v').lean();

    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    return res.status(200).json({ success: true, data: tenant });
  } catch (error) {
    // Handle mongoose validation errors cleanly
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors).map(e => e.message).join(', ');
      return res.status(400).json({ success: false, message: msg });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
