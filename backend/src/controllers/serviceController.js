const Laundry = require('../models/Laundry');
const RoomCleaning = require('../models/tenant/RoomCleaning');
const Visitor = require('../models/tenant/Visitor');
const Leave = require('../models/tenant/Leave');
const { getOrCreateTenant } = require('../utils/tenantHelper');

// Helper to get tenant profile
const getTenantProfile = async (userData) => {
  return await getOrCreateTenant(userData);
};

// Laundry Handlers
exports.createLaundryOrder = async (req, res) => {
  try {
    const { items, pickupDate } = req.body;
    const tenant = await getTenantProfile(req.user);
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    console.log('👕 Creating Laundry Order for:', tenant.email);
    const laundry = await Laundry.create({
      orderNumber,
      items,
      pickupDate,
      tenant: tenant._id,
      user: req.user.id
    });
    console.log('✅ Laundry Order Saved:', laundry._id);
    res.status(201).json(laundry);
  } catch (error) {
    console.error('❌ Laundry Error:', error);
    res.status(500).json({ message: 'Failed to create laundry order', error: error.message });
  }
};

exports.getMyLaundryOrders = async (req, res) => {
  try {
    const orders = await Laundry.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch laundry orders', error: error.message });
  }
};

// Cleaning Handlers
exports.scheduleCleaning = async (req, res) => {
  try {
    const { date, slot } = req.body;
    const tenant = await getTenantProfile(req.user);
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    console.log('🧹 Scheduling Cleaning for:', tenant.email);
    const cleaning = await RoomCleaning.create({
      date,
      slot,
      tenant: tenant._id,
      user: req.user.id
    });
    console.log('✅ Cleaning Scheduled:', cleaning._id);
    res.status(201).json(cleaning);
  } catch (error) {
    console.error('❌ Cleaning Error:', error);
    res.status(500).json({ message: 'Failed to schedule cleaning', error: error.message });
  }
};

exports.getMyCleaningHistory = async (req, res) => {
  try {
    const history = await RoomCleaning.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cleaning history', error: error.message });
  }
};

// Visitor Handlers
exports.createVisitorAccess = async (req, res) => {
  try {
    const { name, relation, arrivalDate } = req.body;
    const tenant = await getTenantProfile(req.user);
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    console.log('🎫 Creating Visitor Access for:', tenant.email);
    const visitor = await Visitor.create({
      name,
      relation,
      arrivalDate,
      tenant: tenant._id,
      user: req.user.id
    });
    console.log('✅ Visitor Access Saved:', visitor._id);
    res.status(201).json(visitor);
  } catch (error) {
    console.error('❌ Visitor Error:', error);
    res.status(500).json({ message: 'Failed to create visitor access', error: error.message });
  }
};

exports.getMyVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch visitor history', error: error.message });
  }
};

// Leave Handlers
exports.submitLeaveNotice = async (req, res) => {
  try {
    const { fromDate, toDate, reason } = req.body;
    const tenant = await getTenantProfile(req.user);
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    console.log('📝 Submitting Leave Notice for:', tenant.email);
    const leave = await Leave.create({
      fromDate,
      toDate,
      reason,
      tenant: tenant._id,
      user: req.user.id
    });
    console.log('✅ Leave Saved:', leave._id);
    res.status(201).json(leave);
  } catch (error) {
    console.error('❌ Leave Submit Error:', error);
    res.status(500).json({ message: 'Failed to submit leave notice', error: error.message });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leave history', error: error.message });
  }
};
