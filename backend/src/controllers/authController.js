const jwt = require('jsonwebtoken');
const User = require('../models/User');
const socketService = require('../utils/socketService');

const register = async (req, res) => {
  const { email, password, name, role, phone, referralCode } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ email, password, name, role, phone });

    if (role === 'TENANT') {
      const Tenant = require('../models/Tenant');
      // Create a default tenant profile so they can raise complaints immediately
      const newTenant = await Tenant.create({ 
        name, 
        email, 
        phone: phone || 'N/A', 
        emergencyContact: 'N/A', 
        status: 'PENDING' 
      });

      // Handle referral rewards if referralCode is provided in body or query
      const refCode = req.body.referralCode || req.query.ref;
      if (refCode) {
        try {
          const User = require('../models/User');
          const referrer = await User.findOne({ referralCode: refCode });
          if (referrer && referrer._id.toString() !== user._id.toString()) {
            const Referral = require('../models/Referral');
            // Safely check if duplicate referral entry doesn't exist
            const duplicate = await Referral.findOne({ referredUserId: user._id });
            if (!duplicate) {
              await Referral.create({
                referrerId: referrer._id,
                referredUserId: user._id,
                referralCode: refCode,
                status: 'PENDING',
                rewardIssued: false
              });

              // Create real-time notification for the referrer
              const { createNotification } = require('../services/notificationService');
              await createNotification({
                userId: referrer._id,
                title: 'Referral Joined',
                message: `Your friend ${name} joined using your referral link.`,
                type: 'REFERRAL_JOIN'
              });
              console.log(`🎁 [REFERRALS] Created pending referral tracking for ${name} referred by ${referrer.name}`);
            }
          }
        } catch (rewardErr) {
          console.error('⚠️ [REWARDS] Failed to handle referrer signup:', rewardErr.message);
        }
      }
      
      // Notify owner dashboard of new signup in real-time
      socketService.emitToOwner('tenantAdded', { _id: newTenant._id, name: newTenant.name, email: newTenant.email, status: 'PENDING' });
      socketService.emitToOwner('dashboardStatsUpdated', {});

      const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({ 
        user, 
        token, 
        tenantProfile: {
          _id: newTenant._id,
          name: newTenant.name,
          email: newTenant.email,
          phone: newTenant.phone,
          buildingId: null,
          status: 'PENDING',
          messPlan: 'basic'
        }
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = await require('bcryptjs').compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    // For tenant users: ensure a Tenant profile exists and return it
    let tenantProfile = null;
    if (user.role === 'TENANT') {
      const Tenant = require('../models/Tenant');
      tenantProfile = await Tenant.findOne({ email: user.email });
      if (!tenantProfile) {
        // Auto-create a stub profile so the portal has something to show
        tenantProfile = await Tenant.create({
          name: user.name,
          email: user.email,
          phone: user.phone || 'N/A',
          emergencyContact: 'N/A',
          status: 'PENDING'
        });
      }
    }

    // For SUPER_ADMIN users: update lastLogin and sync credentials in the admin_profile collection
    if (user.role === 'SUPER_ADMIN') {
      const AdminProfile = require('../models/AdminProfile');
      await AdminProfile.findOneAndUpdate(
        { userId: user._id },
        { 
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          lastLogin: new Date()
        },
        { upsert: true }
      );
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ 
      user, 
      token, 
      tenantProfile: tenantProfile ? {
        _id: tenantProfile._id,
        name: tenantProfile.name,
        email: tenantProfile.email,
        phone: tenantProfile.phone,
        room: tenantProfile.room,
        buildingId: tenantProfile.buildingId,
        status: tenantProfile.status,
        messPlan: tenantProfile.messPlan,
        vegNonVegPreference: tenantProfile.vegNonVegPreference,
        budgetRange: tenantProfile.budgetRange,
        sleepTiming: tenantProfile.sleepTiming,
        primaryLanguage: tenantProfile.primaryLanguage,
        targetStayDuration: tenantProfile.targetStayDuration
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const refreshToken = async (req, res) => {
  // Accept both `refreshToken` (spec) and legacy `token` field
  const token = req.body.refreshToken || req.body.token;
  if (!token) return res.status(400).json({ message: 'Refresh token required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const newToken = jwt.sign({ id: payload.id, role: payload.role, email: payload.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return res.json({ token: newToken, accessToken: newToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

const sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: 'Phone number is required' });

  try {
    const PasswordReset = require('../models/PasswordReset');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    
    // Store phone in the email field of PasswordReset schema for re-usability
    await PasswordReset.create({ email: phone, otp, resetToken, expiresAt });
    
    console.log(`📱 [DEV_OTP] Sending OTP ${otp} to phone ${phone}`);
    res.status(200).json({ success: true, message: 'OTP sent successfully', devOtp: otp });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating OTP', error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ success: false, message: 'Phone and OTP required' });

  try {
    const PasswordReset = require('../models/PasswordReset');
    const record = await PasswordReset.findOne({ email: phone, otp, used: false, expiresAt: { $gt: new Date() } });
    if (!record) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    
    record.used = true;
    await record.save();

    let user = await User.findOne({ phone });
    if (!user) {
      // Auto-register new user on successful OTP if not exists
      user = await User.create({
        phone,
        email: `${phone}@temp.com`, // dummy email
        password: require('crypto').randomBytes(16).toString('hex'),
        name: 'Tenant User',
        role: 'TENANT'
      });
      const Tenant = require('../models/Tenant');
      await Tenant.create({ name: user.name, email: user.email, phone: user.phone, status: 'PENDING' });
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const refreshTokenStr = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({ success: true, message: 'OTP verified', user, token, refreshToken: refreshTokenStr, accessToken: token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const logout = async (req, res) => {
  // Client should discard token; if using cookies, clear them here
  return res.json({ success: true, message: 'Logged out' });
};

module.exports = { register, login, refreshToken, logout, sendOtp, verifyOtp };
