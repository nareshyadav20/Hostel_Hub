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

module.exports = { register, login };
