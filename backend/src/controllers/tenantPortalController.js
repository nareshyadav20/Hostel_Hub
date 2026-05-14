const CommunityReport = require('../models/tenant/CommunityReport');
const Reward = require('../models/tenant/Reward');
const Wishlist = require('../models/tenant/Wishlist');
const SOSAlert = require('../models/SOSAlert');
const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const Laundry = require('../models/Laundry');
const RoomCleaning = require('../models/tenant/RoomCleaning');
const Visitor = require('../models/tenant/Visitor');
const Leave = require('../models/tenant/Leave');
const RoomTransfer = require('../models/RoomTransfer');
const ConfidentialReport = require('../models/ConfidentialReport');
const { getOrCreateTenant } = require('../utils/tenantHelper');
const notificationService = require('../utils/notificationService');

// --- Community Reports ---
exports.createCommunityReport = async (req, res) => {
  try {
    const tenant = await getOrCreateTenant(req.user);
    const report = await CommunityReport.create({
      ...req.body,
      tenant: tenant._id,
      user: req.user.id,
      buildingId: tenant.buildingId
    });
    // Owner Notification
    await notificationService.createNotification({
      portalType: 'Owner',
      moduleName: 'Community',
      category: 'Lost & Found',
      title: 'New Community Report',
      message: `Tenant ${tenant.name} reported a ${req.body.type === 'Lost' ? 'lost' : 'found'} item: ${req.body.title || 'Untitled'}.`,
      priority: 'Medium',
      buildingId: tenant.buildingId,
      actionLink: '/community'
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error creating community report', error: error.message });
  }
};

exports.getCommunityReports = async (req, res) => {
  try {
    const reports = await CommunityReport.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};

// --- SOS Alerts ---
exports.createSOSAlert = async (req, res) => {
  try {
    const tenant = await getOrCreateTenant(req.user);
    const alert = await SOSAlert.create({
      ...req.body,
      reportedBy: tenant.name || 'Tenant',
      buildingId: tenant.buildingId,
      user: req.user.id,
      tenant: tenant._id
    });

    // Real-time SOS notification for owner and safety teams
    const socketService = require('../utils/socketService');
    socketService.emitToOwner('sosCreated', { alert, tenantName: tenant.name });
    if (tenant.buildingId) {
      socketService.emitUpdate(tenant.buildingId.toString(), 'sosCreated', { alert, tenantName: tenant.name });
    }

    // SOS Notifications
    await notificationService.createNotification({
      portalType: 'Tenant',
      moduleName: 'Security',
      category: 'Alert',
      title: 'SOS Alert Received',
      message: 'Your SOS alert has been received. Help is being dispatched.',
      priority: 'High',
      type: 'error',
      buildingId: tenant.buildingId,
      tenantId: tenant._id,
      actionLink: '/safety'
    });

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error creating SOS alert', error: error.message });
  }
};

// --- Rewards ---
exports.getMyRewards = async (req, res) => {
  try {
    const tenant = await getOrCreateTenant(req.user);
    let rewards = await Reward.findOne({ user: req.user.id });

    if (!rewards) {
      rewards = await Reward.create({
        tenant: tenant._id,
        user: req.user.id,
        points: 100, // Welcome points
        lifetimeEarned: 100
      });

      // Reward Notification
      await notificationService.createNotification({
        portalType: 'Tenant',
        moduleName: 'Rewards',
        category: 'Points',
        title: 'Welcome Points!',
        message: 'You have received 100 points as a welcome gift.',
        priority: 'Low',
        type: 'success',
        buildingId: tenant.buildingId,
        tenantId: tenant._id,
        actionLink: '/rewards'
      });
    }
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rewards', error: error.message });
  }
};

// --- Wishlist ---
exports.addToWishlist = async (req, res) => {
  try {
    const tenant = await getOrCreateTenant(req.user);
    const item = await Wishlist.findOneAndUpdate(
      { user: req.user.id, hostelId: req.body.hostelId },
      { ...req.body, tenant: tenant._id, user: req.user.id },
      { upsert: true, new: true }
    );
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};

exports.getMyWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.deleteOne({ user: req.user.id, _id: req.params.id });
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
};

// --- Complete Profile Aggregation ---
exports.getCompleteProfile = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ email: req.user.email })
      .populate('buildingId', 'name address')
      .populate('roomId', 'roomNumber roomType hygieneRating smartLock ventilationScore tempComfortScore')
      .populate('bedId', 'bedNumber comfortScore lastSanitized position');

    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    // Fetch all related histories in parallel
    const [
      payments,
      complaints,
      laundry,
      cleaning,
      visitors,
      leaves,
      transfers,
      confidentialReports,
      sosAlerts,
      existingRewards
    ] = await Promise.all([
      Payment.find({ tenantId: tenant._id }).sort({ createdAt: -1 }),
      Complaint.find({ tenant: tenant._id }).sort({ createdAt: -1 }),
      Laundry.find({ user: req.user.id }).sort({ createdAt: -1 }),
      RoomCleaning.find({ user: req.user.id }).sort({ createdAt: -1 }),
      Visitor.find({ user: req.user.id }).sort({ createdAt: -1 }),
      Leave.find({ user: req.user.id }).sort({ createdAt: -1 }),
      RoomTransfer.find({ user: req.user.id }).sort({ createdAt: -1 }),
      ConfidentialReport.find({ tenant: tenant._id }).sort({ createdAt: -1 }),
      SOSAlert.find({ tenant: tenant._id }).sort({ createdAt: -1 }),
      Reward.findOne({ user: req.user.id })
    ]);

    let rewards = existingRewards;
    if (!rewards) {
      rewards = await Reward.create({
        tenant: tenant._id,
        user: req.user.id,
        points: 100, // Welcome points
        lifetimeEarned: 100
      });
    }

    res.status(200).json({
      tenant,
      payments,
      complaints,
      history: {
        laundry,
        cleaning,
        visitors,
        leaves,
        transfers,
        confidentialReports,
        sosAlerts
      },
      rewards
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complete profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      'phone', 'emergencyContact', 'occupation', 'organization',
      'vegNonVegPreference', 'allergyTracking', 'favoriteMeals',
      'sleepTiming', 'primaryLanguage', 'preferences'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const tenant = await Tenant.findOneAndUpdate(
      { email: req.user.email },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    // Emit real-time update
    const socketService = require('../utils/socketService');
    if (tenant.buildingId) {
      socketService.emitUpdate(tenant.buildingId.toString(), 'tenantUpdated', { tenantId: tenant._id });
    }

    // Owner Notification
    if (tenant.buildingId) {
      await notificationService.createNotification({
        portalType: 'Owner',
        moduleName: 'Tenants',
        category: 'Profile',
        title: 'Tenant Profile Updated',
        message: `Tenant ${tenant.name} has updated their profile information.`,
        priority: 'Low',
        buildingId: tenant.buildingId,
        actionLink: `/tenants`
      });
    }

    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const profilePicUrl = `/uploads/profiles/${req.file.filename}`;
    const tenant = await Tenant.findOneAndUpdate(
      { email: req.user.email },
      { $set: { profilePic: profilePicUrl } },
      { new: true }
    );

    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    res.status(200).json({ message: 'Profile picture updated', profilePic: profilePicUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading profile picture', error: error.message });
  }
};

exports.payRent = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ email: req.user.email })
      .populate('buildingId');

    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    if (tenant.rentStatus === 'PAID') return res.status(400).json({ message: 'Rent already paid' });

    // Create Payment Record
    const payment = await Payment.create({
      tenantId: tenant._id,
      buildingId: tenant.buildingId?._id,
      amount: tenant.rent || 0,
      status: 'Paid',
      type: 'Rent',
      method: 'UPI',
      invoice: `RENT-${Date.now().toString().slice(-6)}`,
      transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    });

    // Update Tenant Status
    tenant.rentStatus = 'PAID';
    await tenant.save();

    // Emit Real-time Updates
    const socketService = require('../utils/socketService');
    if (tenant.buildingId) {
      socketService.emitUpdate(tenant.buildingId._id.toString(), 'paymentAdded', { payment });
      socketService.emitUpdate(tenant.buildingId._id.toString(), 'tenantUpdated', { tenantId: tenant._id });
    }

    // Rent Notification
    await notificationService.createNotification({
      portalType: 'Tenant',
      moduleName: 'Payments',
      category: 'Rent',
      title: 'Rent Paid',
      message: `Your rent payment of ₹${payment.amount} was successful.`,
      priority: 'Medium',
      type: 'success',
      buildingId: tenant.buildingId?._id || tenant.buildingId,
      tenantId: tenant._id,
      actionLink: '/payments'
    });

    // Owner Notification
    if (tenant.buildingId) {
      await notificationService.createNotification({
        portalType: 'Owner',
        moduleName: 'Payments',
        category: 'Rent',
        title: 'Rent Received',
        message: `Tenant ${tenant.name} paid ₹${payment.amount} for rent via UPI.`,
        priority: 'Medium',
        buildingId: tenant.buildingId,
        actionLink: '/payments'
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

