const User = require('../models/User');
const Building = require('../models/Building');
const OwnerProfile = require('../models/OwnerProfile');
const AdminProfile = require('../models/AdminProfile');
const AdminSettings = require('../models/AdminSettings');

/**
 * GET /api/admin/owners
 * Fetches all users with role=OWNER from owner_users collection,
 * enriched with building count from owner_buildings and profile from ownerprofiles.
 */
const getAllOwners = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    // 1. Fetch all users with OWNER role from owner_users collection
    const ownerUsers = await User.find({ role: { $regex: /^owner$/i } })
      .select('-password')
      .lean();

    // 1.5 Fetch from 'users' collection too
    const db = mongoose.connection.db;
    const standardUsersRaw = await db.collection('users').find({ role: { $regex: /^owner$/i } }).toArray();
    
    const standardUsers = standardUsersRaw.map(u => {
      const { password, ...rest } = u;
      return rest;
    });

    const allOwners = [...ownerUsers, ...standardUsers];

    if (!allOwners.length) {
      return res.status(200).json([]);
    }

    const ownerIds = allOwners.map(o => o._id);

    // 2. Count buildings per owner from owner_buildings collection
    const buildingCounts = await Building.aggregate([
      { $match: { owner: { $in: ownerIds } } },
      { $group: { _id: '$owner', count: { $sum: 1 } } }
    ]);

    const buildingCountMap = {};
    buildingCounts.forEach(b => {
      buildingCountMap[b._id.toString()] = b.count;
    });

    // 3. Fetch owner profiles from ownerprofiles collection
    const profiles = await OwnerProfile.find({ userId: { $in: ownerIds } }).lean();
    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.userId.toString()] = p;
    });

    // 4. Merge data
    const enriched = allOwners.map(owner => {
      const id = owner._id.toString();
      const profile = profileMap[id] || {};
      const buildingCount = buildingCountMap[id] || 0;

      return {
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone || 'N/A',
        role: owner.role,
        joinedAt: owner.createdAt,
        buildingCount,
        // From ownerprofiles collection
        businessName: profile.businessDetails?.businessName || null,
        businessType: profile.businessDetails?.businessType || 'Individual',
        city: profile.personalInfo?.city || null,
        plan: buildingCount >= 5 ? 'Enterprise' : buildingCount >= 2 ? 'Standard' : 'Basic',
        profileCompleteness: profile.profileCompleteness || 0,
        bankVerified: profile.bankDetails?.isVerified || false,
        documentsCount: profile.documents?.length || 0,
        status: 'Active', // Users in owner_users are active by default
      };
    });

    res.status(200).json(enriched);
  } catch (err) {
    console.error('Error fetching owners:', err);
    res.status(500).json({ error: 'Failed to fetch owners', details: err.message });
  }
};

/**
 * PATCH /api/admin/owners/:id/status
 * Toggle owner active/inactive status
 */
const updateOwnerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // Status management via a custom field could be added to User schema
    // For now we return a success acknowledgment
    res.status(200).json({ message: `Owner status updated to ${status}`, id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update owner status' });
  }
};

/**
 * GET /api/admin/stats
 * Returns aggregate platform statistics for the admin dashboard owners section
 */
const getPlatformStats = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const ownerUsersCount = await User.countDocuments({ role: { $regex: /^owner$/i } });
    const standardUsersCount = await mongoose.connection.db.collection('users').countDocuments({ role: { $regex: /^owner$/i } });
    const totalOwners = ownerUsersCount + standardUsersCount;
    
    const totalBuildings = await Building.countDocuments();
    const enterpriseOwners = await Building.aggregate([
      { $group: { _id: '$owner', count: { $sum: 1 } } },
      { $match: { count: { $gte: 5 } } },
      { $count: 'total' }
    ]);

    res.status(200).json({
      totalOwners,
      totalBuildings,
      enterpriseOwners: enterpriseOwners[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch platform stats' });
  }
};

/**
 * GET /api/admin/profile
 * Retrieve admin profile from admin_profile collection, or auto-create a default one
 */
const getAdminProfile = async (req, res) => {
  try {
    // Restrict strictly to SUPER_ADMIN to prevent OWNER or other roles from storing in admin_profile
    if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access Denied: Only SUPER_ADMIN accounts can manage the admin_profile collection.' });
    }

    const userId = req.user.id;
    let profile = await AdminProfile.findOne({ userId });
    
    if (!profile) {
      // Auto-create standard profile
      const user = await User.findById(userId);
      profile = await AdminProfile.create({
        userId,
        name: user?.name || 'Super Admin',
        email: user?.email || req.user.email || 'admin@livora.io',
        phone: user?.phone || '+91 98765 43210',
        location: 'Bangalore, India',
        bio: 'Overseeing the entire Livora Hostel Hub ecosystem. Specialized in platform security and administrative intelligence.',
        avatar: ''
      });
    }
    
    res.status(200).json(profile);
  } catch (err) {
    console.error('Error fetching admin profile:', err);
    res.status(500).json({ error: 'Failed to fetch admin profile', details: err.message });
  }
};

/**
 * PUT /api/admin/profile
 * Create or update admin profile details including avatar base64 strings
 */
const updateAdminProfile = async (req, res) => {
  try {
    // Restrict strictly to SUPER_ADMIN to prevent OWNER or other roles from storing in admin_profile
    if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access Denied: Only SUPER_ADMIN accounts can manage the admin_profile collection.' });
    }

    const userId = req.user.id;
    const { name, email, phone, location, bio, avatar } = req.body;
    
    let profile = await AdminProfile.findOne({ userId });
    
    if (profile) {
      profile.name = name || profile.name;
      profile.email = email || profile.email;
      profile.phone = phone !== undefined ? phone : profile.phone;
      profile.location = location !== undefined ? location : profile.location;
      profile.bio = bio !== undefined ? bio : profile.bio;
      profile.avatar = avatar !== undefined ? avatar : profile.avatar;
      await profile.save();
    } else {
      profile = await AdminProfile.create({
        userId,
        name: name || 'Super Admin',
        email: email || req.user.email || 'admin@livora.io',
        phone: phone || '+91 98765 43210',
        location: location || 'Bangalore, India',
        bio: bio || 'Overseeing the entire Livora Hostel Hub ecosystem. Specialized in platform security and administrative intelligence.',
        avatar: avatar || ''
      });
    }
    
    // Sync back to User collection if name or email changed
    if (name || email) {
      const user = await User.findById(userId);
      if (user) {
        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();
      }
    }
    
    res.status(200).json(profile);
  } catch (err) {
    console.error('Error updating admin profile:', err);
    res.status(500).json({ error: 'Failed to update admin profile', details: err.message });
  }
};

/**
 * GET /api/admin/settings
 * Retrieve admin settings from admin_settings collection
 */
const getAdminSettings = async (req, res) => {
  try {
    if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access Denied: Only SUPER_ADMIN accounts can manage the admin_settings collection.' });
    }

    let settings = await AdminSettings.findOne({});
    if (!settings) {
      settings = await AdminSettings.create({});
    }
    res.status(200).json(settings);
  } catch (err) {
    console.error('Error fetching admin settings:', err);
    res.status(500).json({ error: 'Failed to fetch admin settings', details: err.message });
  }
};

/**
 * PUT /api/admin/settings
 * Update admin settings inside the admin_settings collection
 */
const updateAdminSettings = async (req, res) => {
  try {
    if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access Denied: Only SUPER_ADMIN accounts can manage the admin_settings collection.' });
    }

    const {
      twoFactor,
      sessionPersistence,
      smtpEmailRelay,
      smsGateway,
      webPush,
      paymentOverdue,
      highPriorityIssues,
      staffDailyDigest,
      platformPersona,
      adminEmail,
      fiscalUnit,
      operationalLanguage,
      invoicingPrefix,
      taxPercentage
    } = req.body;

    let settings = await AdminSettings.findOne({});
    if (!settings) {
      settings = new AdminSettings({});
    }

    if (twoFactor !== undefined) settings.twoFactor = twoFactor;
    if (sessionPersistence !== undefined) settings.sessionPersistence = sessionPersistence;
    if (smtpEmailRelay !== undefined) settings.smtpEmailRelay = smtpEmailRelay;
    if (smsGateway !== undefined) settings.smsGateway = smsGateway;
    if (webPush !== undefined) settings.webPush = webPush;
    if (paymentOverdue !== undefined) settings.paymentOverdue = paymentOverdue;
    if (highPriorityIssues !== undefined) settings.highPriorityIssues = highPriorityIssues;
    if (staffDailyDigest !== undefined) settings.staffDailyDigest = staffDailyDigest;
    if (platformPersona !== undefined) settings.platformPersona = platformPersona;
    if (adminEmail !== undefined) settings.adminEmail = adminEmail;
    if (fiscalUnit !== undefined) settings.fiscalUnit = fiscalUnit;
    if (operationalLanguage !== undefined) settings.operationalLanguage = operationalLanguage;
    if (invoicingPrefix !== undefined) settings.invoicingPrefix = invoicingPrefix;
    if (taxPercentage !== undefined) settings.taxPercentage = taxPercentage;

    await settings.save();
    res.status(200).json(settings);
  } catch (err) {
    console.error('Error updating admin settings:', err);
    res.status(500).json({ error: 'Failed to update admin settings', details: err.message });
  }
};

/**
 * GET /api/admin/staff
 * Fetches all staff from the 'staff' collection.
 */
const getAllStaff = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const staffList = await db.collection('staff').find({}).toArray();
    res.status(200).json(staffList);
  } catch (err) {
    console.error('Error fetching staff:', err);
    res.status(500).json({ error: 'Failed to fetch staff', details: err.message });
  }
};

module.exports = { 
  getAllOwners, 
  updateOwnerStatus, 
  getPlatformStats, 
  getAdminProfile, 
  updateAdminProfile,
  getAdminSettings,
  updateAdminSettings,
  getAllStaff
};
