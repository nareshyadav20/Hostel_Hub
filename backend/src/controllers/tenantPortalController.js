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

// --- Community Reports ---
exports.createCommunityReport = async (req, res) => {
  try {
    const tenant = await getOrCreateTenant(req.user);
    const report = await CommunityReport.create({
      ...req.body,
      tenant: tenant._id,
      user: req.user.id
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
