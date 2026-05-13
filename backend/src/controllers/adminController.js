/**
 * Admin Controller — Centralized CRUD for the Admin Portal
 * Provides unrestricted access to all collections for the master admin dashboard.
 * Reuses existing Mongoose models from the shared backend.
 */

const OwnerProfile = require('../models/OwnerProfile');
const Tenant = require('../models/Tenant');
const Building = require('../models/Building');
const Room = require('../models/Room');
const Bed = require('../models/Bed');
const Floor = require('../models/Floor');
const Complaint = require('../models/Complaint');
const Payment = require('../models/Payment');
const Inventory = require('../models/Inventory');
const Staff = require('../models/Staff');
const Notification = require('../models/Notification');
const User = require('../models/User');

// ═══════════════════════════════════════════
// OWNERS MANAGEMENT
// ═══════════════════════════════════════════

exports.getAllOwners = async (req, res) => {
  try {
    const { search, status, plan, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && status !== 'All') filter.verificationStatus = status;
    if (plan && plan !== 'All') filter.subscriptionPlan = plan;
    if (search) {
      filter.$or = [
        { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
        { 'businessDetails.businessName': { $regex: search, $options: 'i' } }
      ];
    }

    const total = await OwnerProfile.countDocuments(filter);
    const owners = await OwnerProfile.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Enrich each owner with hostel/building count
    const enriched = await Promise.all(owners.map(async (owner) => {
      const hostelCount = await Building.countDocuments({ owner: owner.userId?._id || owner.userId });
      const tenantCount = await Tenant.countDocuments({ buildingId: { $in: (await Building.find({ owner: owner.userId?._id || owner.userId }).select('_id')).map(b => b._id) } });
      return {
        ...owner.toObject(),
        hostelCount,
        tenantCount
      };
    }));

    res.json({ owners: enriched, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOwnerById = async (req, res) => {
  try {
    const owner = await OwnerProfile.findById(req.params.id).populate('userId', 'name email phone');
    if (!owner) return res.status(404).json({ error: 'Owner not found' });
    res.json(owner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOwnerStatus = async (req, res) => {
  try {
    const { verificationStatus, subscriptionPlan } = req.body;
    const update = {};
    if (verificationStatus) update.verificationStatus = verificationStatus;
    if (subscriptionPlan) update.subscriptionPlan = subscriptionPlan;

    const owner = await OwnerProfile.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!owner) return res.status(404).json({ error: 'Owner not found' });
    res.json(owner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOwner = async (req, res) => {
  try {
    const owner = await OwnerProfile.findByIdAndDelete(req.params.id);
    if (!owner) return res.status(404).json({ error: 'Owner not found' });
    res.json({ message: 'Owner removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ═══════════════════════════════════════════
// TENANTS MANAGEMENT (Admin-level, no owner scoping)
// ═══════════════════════════════════════════

exports.getAllTenants = async (req, res) => {
  try {
    const { search, status, rentStatus, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && status !== 'All') filter.status = status.toUpperCase();
    if (rentStatus && rentStatus !== 'All') filter.rentStatus = rentStatus.toUpperCase();
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { room: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Tenant.countDocuments(filter);
    const tenants = await Tenant.find(filter)
      .populate('buildingId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ tenants, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTenant = async (req, res) => {
  try {
    const tenant = new Tenant(req.body);
    await tenant.save();
    res.status(201).json(tenant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json(tenant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTenant = async (req, res) => {
  try {
    await Tenant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tenant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ═══════════════════════════════════════════
// BUILDINGS (Admin-level)
// ═══════════════════════════════════════════

exports.getAllBuildings = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    const total = await Building.countDocuments(filter);
    const buildings = await Building.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Enrich with room/tenant counts
    const enriched = await Promise.all(buildings.map(async (b) => {
      const roomCount = await Room.countDocuments({ buildingId: b._id });
      const tenantCount = await Tenant.countDocuments({ buildingId: b._id });
      const bedCount = await Bed.countDocuments({ buildingId: b._id });
      return { ...b.toObject(), roomCount, tenantCount, bedCount };
    }));

    res.json({ buildings: enriched, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { roomNumber: { $regex: search, $options: 'i' } },
        { roomType: { $regex: search, $options: 'i' } }
      ];
    }
    const total = await Room.countDocuments(filter);
    const rooms = await Room.find(filter)
      .populate('buildingId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ rooms, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBeds = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;

    const total = await Bed.countDocuments(filter);
    const beds = await Bed.find(filter)
      .populate('roomId', 'roomNumber')
      .populate('buildingId', 'name')
      .populate('currentTenant', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ beds, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ═══════════════════════════════════════════
// COMPLAINTS (Admin-level)
// ═══════════════════════════════════════════

exports.getAllComplaints = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate('tenant', 'name email phone room')
      .populate('buildingId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ complaints, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ═══════════════════════════════════════════
// PAYMENTS (Admin-level)
// ═══════════════════════════════════════════

exports.getAllPayments = async (req, res) => {
  try {
    const { status, type, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (type && type !== 'All') filter.type = type;

    const total = await Payment.countDocuments(filter);
    const payments = await Payment.find(filter)
      .populate('tenantId', 'name email phone room')
      .populate('buildingId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Calculate aggregates
    const totalRevenue = await Payment.aggregate([
      { $match: { status: { $in: ['Paid', 'Success'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingAmount = await Payment.aggregate([
      { $match: { status: { $in: ['Pending', 'Due', 'Overdue'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      payments, total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingAmount: pendingAmount[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ═══════════════════════════════════════════
// INVENTORY (Admin-level)
// ═══════════════════════════════════════════

exports.getAllInventory = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    const total = await Inventory.countDocuments(filter);
    const items = await Inventory.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ items, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ═══════════════════════════════════════════
// STAFF (Admin-level)
// ═══════════════════════════════════════════

exports.getAllStaff = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }
    const total = await Staff.countDocuments(filter);
    const staff = await Staff.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ staff, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ═══════════════════════════════════════════
// NOTIFICATIONS (Admin-level)
// ═══════════════════════════════════════════

exports.getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const total = await Notification.countDocuments();
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ notifications, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ═══════════════════════════════════════════
// PLATFORM STATS (Admin KPIs)
// ═══════════════════════════════════════════

exports.getPlatformStats = async (req, res) => {
  try {
    const [totalOwners, totalTenants, totalBuildings, totalRooms, totalBeds, totalComplaints, totalPayments, totalStaff] = await Promise.all([
      OwnerProfile.countDocuments(),
      Tenant.countDocuments(),
      Building.countDocuments(),
      Room.countDocuments(),
      Bed.countDocuments(),
      Complaint.countDocuments(),
      Payment.countDocuments(),
      Staff.countDocuments()
    ]);

    const activeOwners = await OwnerProfile.countDocuments({ verificationStatus: 'Verified' });
    const pendingOwners = await OwnerProfile.countDocuments({ verificationStatus: 'Pending' });
    const activeTenants = await Tenant.countDocuments({ status: 'ACTIVE' });
    const pendingTenants = await Tenant.countDocuments({ status: 'PENDING' });
    const openComplaints = await Complaint.countDocuments({ status: { $in: ['Open', 'Pending', 'In Progress'] } });
    const vacantBeds = await Bed.countDocuments({ status: { $in: ['available', 'Available', 'AVAILABLE'] } });

    res.json({
      totalOwners, activeOwners, pendingOwners,
      totalTenants, activeTenants, pendingTenants,
      totalBuildings, totalRooms, totalBeds, vacantBeds,
      totalComplaints, openComplaints,
      totalPayments, totalStaff
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
