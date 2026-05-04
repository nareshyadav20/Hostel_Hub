const CommunityReport = require('../models/tenant/CommunityReport');
const Reward = require('../models/tenant/Reward');
const Wishlist = require('../models/tenant/Wishlist');
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
