const mongoose = require('mongoose');
const Building = require('../models/Building');
const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const SystemSettings = require('../models/SystemSettings');
const Staff = require('../models/Staff');

// Helper: traverse the nested property hierarchy
const traverseHierarchy = (buildings) => {
  let totalBeds = 0, occupiedBeds = 0, maintenanceRooms = 0;
  const buildingWise = [], floorWise = [];

  buildings.forEach(b => {
    let bOcc = 0, bTot = 0;
    (b.floors || []).forEach(f => {
      let fOcc = 0, fTot = 0;
      (f.rooms || []).forEach(r => {
        if (r.status === 'Maintenance') maintenanceRooms++;
        (r.beds || []).forEach(bed => {
          totalBeds++; bTot++; fTot++;
          if (bed.status === 'OCCUPIED') { occupiedBeds++; bOcc++; fOcc++; }
        });
      });
      floorWise.push({ name: `${b.name} F${f.floorNumber}`, occupied: fOcc, vacant: fTot - fOcc, total: fTot });
    });
    buildingWise.push({ name: b.name, occupied: bOcc, vacant: bTot - bOcc, total: bTot });
  });

  return { totalBeds, occupiedBeds, maintenanceRooms, buildingWise, floorWise };
};

const MessMenu = require('../models/MessMenu');
const MessAttendance = require('../models/MessAttendance');

// ─── Helper: Validate & cast buildingId ──────────────────────────────────────
const parseId = (id) => {
  if (id && mongoose.Types.ObjectId.isValid(id) && id !== 'undefined' && id !== 'null') {
    return new mongoose.Types.ObjectId(id);
  }
  return null;
};

// ─── Helper: Get floors, rooms, beds for given building IDs ──────────────────
const getHierarchyCounts = async (buildingIds) => {
  const db = mongoose.connection.db;

  // 1. owner_buildings side
  const ownerFloors = await db.collection('owner_floors').find(
    { buildingId: { $in: buildingIds } }
  ).toArray();
  const ownerFloorIds = ownerFloors.map(f => f._id);

  const ownerRooms = ownerFloorIds.length > 0
    ? await db.collection('owner_rooms').find({ floor: { $in: ownerFloorIds } }).toArray()
    : [];
  const ownerRoomIds = ownerRooms.map(r => r._id);
  const ownerMaintCount = ownerRooms.filter(r => r.status === 'Maintenance').length;

  const ownerBeds = ownerRoomIds.length > 0
    ? await db.collection('owner_beds').countDocuments({ roomId: { $in: ownerRoomIds } })
    : 0;
  const ownerOccupied = ownerRoomIds.length > 0
    ? await db.collection('owner_beds').countDocuments({ roomId: { $in: ownerRoomIds }, status: 'OCCUPIED' })
    : 0;

  // 2. buildings (raw) side
  const rawFloors = await db.collection('floors').find(
    { building: { $in: buildingIds } }
  ).toArray();
  const rawFloorIds = rawFloors.map(f => f._id);

  const rawRooms = rawFloorIds.length > 0
    ? await db.collection('rooms').find({ floor: { $in: rawFloorIds } }).toArray()
    : [];
  const rawRoomIds = rawRooms.map(r => r._id);
  const rawMaintCount = rawRooms.filter(r => r.status === 'Maintenance').length;

  const rawBeds = rawRoomIds.length > 0
    ? await db.collection('beds').countDocuments({ roomId: { $in: rawRoomIds } })
    : 0;
  const rawOccupied = rawRoomIds.length > 0
    ? await db.collection('beds').countDocuments({ roomId: { $in: rawRoomIds }, status: 'OCCUPIED' })
    : 0;

  return {
    totalBeds: ownerBeds + rawBeds,
    occupiedBeds: ownerOccupied + rawOccupied,
    maintenanceRoomsCount: ownerMaintCount + rawMaintCount,
    rooms: [...ownerRooms, ...rawRooms],
    floorIds: [...ownerFloorIds, ...rawFloorIds]
  };
};

// ─── GET /api/dashboard/summary ──────────────────────────────────────────────
exports.getSummaryKPIs = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const mongoose = require('mongoose');
    const Building = require('../models/Building');
    const Tenant = require('../models/Tenant');
    const Payment = require('../models/Payment');
    const Complaint = require('../models/Complaint');
    const User = require('../models/User');
    const SystemSettings = require('../models/SystemSettings');

    const isAdmin = req.user.role === 'SUPER_ADMIN';

    // 1. Isolate buildings
    let ownerBuildings;
    if (isAdmin) {
      ownerBuildings = await Building.find().select('_id name');
    } else {
      ownerBuildings = await Building.find({ owner: req.user.id }).select('_id name');
    }
    const ownerBuildingIds = ownerBuildings.map(b => b._id);

    let activeBuildingIds = [];
    let selectedBuildingName = 'All Properties';

    if (buildingId) {
      const isOwned = ownerBuildingIds.some(id => id.toString() === buildingId.toString());
      if (!isOwned) {
        return res.status(403).json({ error: 'Access denied: building does not belong to you.' });
      }
      activeBuildingIds = [new mongoose.Types.ObjectId(buildingId)];
      const bObj = ownerBuildings.find(b => b._id.toString() === buildingId.toString());
      selectedBuildingName = bObj ? bObj.name : 'Selected Property';
    } else {
      activeBuildingIds = ownerBuildingIds;
    }

    const matchQuery = { _id: { $in: activeBuildingIds } };

    // 2. Check number of beds available
    const stats = await Building.aggregate([
      { $match: matchQuery },
      { $lookup: { from: 'floors', localField: 'floors', foreignField: '_id', as: 'floorData' } },
      { $unwind: { path: '$floorData', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'rooms', localField: 'floorData.rooms', foreignField: '_id', as: 'roomData' } },
      { $unwind: { path: '$roomData', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'beds', localField: 'roomData.beds', foreignField: '_id', as: 'bedData' } },
      { $unwind: { path: '$bedData', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalBeds: { $sum: { $cond: [{ $ifNull: ['$bedData._id', false] }, 1, 0] } },
          occupiedBeds: { $sum: { $cond: [{ $eq: ['$bedData.status', 'OCCUPIED'] }, 1, 0] } },
          maintenanceRooms: { $addToSet: { $cond: [{ $eq: ['$roomData.status', 'Maintenance'] }, '$roomData._id', null] } },
          buildingCount: { $addToSet: '$_id' }
        }
      }
    ]);

    const s = stats[0] || { totalBeds: 0, occupiedBeds: 0, maintenanceRooms: [], buildingCount: [] };
    const maintenanceRoomsCount = s.maintenanceRooms.filter(id => id !== null).length;
    const buildingCount = s.buildingCount.length;

    // 3. Tenants count
    const tenantFilter = { buildingId: { $in: activeBuildingIds } };
    const totalTenants = await Tenant.countDocuments(tenantFilter);

    // 4. Calculate occupancy rate
    let totalBeds = s.totalBeds;
    let occupiedBeds = s.occupiedBeds || totalTenants;

    if (totalBeds === 0 && totalTenants > 0) {
      totalBeds = totalTenants;
      occupiedBeds = totalTenants;
    } else {
      totalBeds = Math.max(totalBeds, totalTenants);
    }
    const vacantBeds = Math.max(0, totalBeds - occupiedBeds);
    const occupancyRate = totalBeds > 0 ? parseFloat(((occupiedBeds / totalBeds) * 100).toFixed(1)) : 0;

    // 5. Payments metrics
    const payMatch = {
      $or: [
        { buildingId: { $in: activeBuildingIds.map(id => id.toString()) } },
        { buildingId: { $in: activeBuildingIds } }
      ]
    };

    const payments = await Payment.find(payMatch);
    const pendingPayments = payments.filter(p => p.status === 'Pending' || p.status === 'Due');
    const pendingPaymentsCount = pendingPayments.length;
    const pendingPaymentsAmount = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // 6. Health Score (Dynamic)
    const settings = await SystemSettings.findOne(isAdmin ? {} : { owner: req.user.id });
    const defaultRent = settings?.rentSettings?.defaultRent?.single || 8000;

    const occupancyScore = Math.min(40, (occupancyRate / 100) * 40);
    const paymentScore = Math.max(0, 30 - (pendingPaymentsCount * 1.5));
    const maintenanceScore = Math.max(0, 20 - (maintenanceRoomsCount * 2));
    const healthScore = Math.round(occupancyScore + paymentScore + maintenanceScore + 10);

    // 7. Daily Activity Stats
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

    const todayRevenue = payments
      .filter(p => p.status === 'Paid' && new Date(p.date) >= startOfDay && new Date(p.date) <= endOfDay)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const complaintsToday = await Complaint.countDocuments({
      createdAt: { $gte: startOfDay },
      buildingId: { $in: activeBuildingIds }
    });

    const checkinsToday = await Tenant.countDocuments({
      createdAt: { $gte: startOfDay },
      buildingId: { $in: activeBuildingIds }
    });

    const ownerCount = await User.countDocuments({ role: { $regex: /^owner$/i } });

    res.json({
      totalBeds, occupiedBeds, vacantBeds, occupancyRate,
      todayRevenue,
      expectedMonthlyRevenue: totalTenants * defaultRent,
      pendingPaymentsCount,
      pendingPaymentsAmount,
      maintenanceRooms: maintenanceRoomsCount,
      healthScore,
      buildingCount,
      totalTenants,
      ownerCount,
      complaintsToday,
      checkinsToday,
      buildingName: selectedBuildingName
    });
  } catch (error) {
    console.error('Summary Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/dashboard/revenue ──────────────────────────────────────────────
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const mongoose = require('mongoose');
    const Building = require('../models/Building');
    const Payment = require('../models/Payment');
    const Tenant = require('../models/Tenant');
    const isAdmin = req.user.role === 'SUPER_ADMIN';

    const ownerBuildings = isAdmin
      ? await Building.find().select('_id')
      : await Building.find({ owner: req.user.id }).select('_id');
    const ownerBuildingIds = ownerBuildings.map(b => b._id);

    let activeBuildingIds = [];
    if (buildingId) {
      const isOwned = ownerBuildingIds.some(id => id.toString() === buildingId.toString());
      if (!isOwned) return res.status(403).json({ error: 'Access denied.' });
      activeBuildingIds = [new mongoose.Types.ObjectId(buildingId)];
    } else {
      activeBuildingIds = ownerBuildingIds;
    }

    const payMatch = {
      $or: [
        { buildingId: { $in: activeBuildingIds.map(id => id.toString()) } },
        { buildingId: { $in: activeBuildingIds } }
      ]
    };

    const payments = await Payment.find(payMatch);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyRevenue = days.map((name, i) => {
      const dayPayments = payments.filter(p => new Date(p.date).getDay() === i && p.status === 'Paid');
      return { name, expected: 10000, actual: dayPayments.reduce((sum, p) => sum + (p.amount || 0), 0) };
    });

    const collectedRent = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingRent = payments.filter(p => ['Pending', 'Due'].includes(p.status)).reduce((sum, p) => sum + (p.amount || 0), 0);

    const tenantCount = await Tenant.countDocuments({ buildingId: { $in: activeBuildingIds } });

    res.json({
      dailyRevenue,
      monthlyRevenue: [
        { name: 'Prev Month', revenue: collectedRent * 0.8, expenses: collectedRent * 0.2 },
        { name: 'Current', revenue: collectedRent, expenses: collectedRent * 0.25 }
      ],
      rentMetrics: {
        pendingRent,
        collectedRent,
        securityDepositsHeld: tenantCount * 10000,
        totalIncome: collectedRent,
        totalExpenses: collectedRent * 0.25,
        netProfit: collectedRent * 0.75
      }
    });
  } catch (error) {
    console.error('Revenue Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/dashboard/occupancy ────────────────────────────────────────────
exports.getOccupancyStats = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const mongoose = require('mongoose');

    const isAdmin = req.user.role === 'SUPER_ADMIN';
    const ownerBuildings = isAdmin 
      ? await Building.find().select('_id') 
      : await Building.find({ owner: req.user.id }).select('_id');
    const ownerBuildingIds = ownerBuildings.map(b => b._id);

    let activeBuildingIds = [];
    if (buildingId) {
      const isOwned = ownerBuildingIds.some(id => id.toString() === buildingId.toString());
      if (!isOwned) return res.status(403).json({ error: 'Access denied.' });
      activeBuildingIds = [new mongoose.Types.ObjectId(buildingId)];
    } else {
      activeBuildingIds = ownerBuildingIds;
    }

    const buildings = await Building.find({ _id: { $in: activeBuildingIds } }).populate({
      path: 'floors',
      populate: { path: 'rooms', populate: { path: 'beds' } }
    });
    const { buildingWise, floorWise } = traverseHierarchy(buildings);
    res.json({ buildingWise, floorWise });
  } catch (error) {
    console.error('Occupancy Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/dashboard/alerts ───────────────────────────────────────────────
exports.getAlertsAndInsights = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const mongoose = require('mongoose');

    const isAdmin = req.user.role === 'SUPER_ADMIN';
    const ownerBuildings = isAdmin 
      ? await Building.find().select('_id') 
      : await Building.find({ owner: req.user.id }).select('_id');
    const ownerBuildingIds = ownerBuildings.map(b => b._id);

    let activeBuildingIds = [];
    if (buildingId) {
      const isOwned = ownerBuildingIds.some(id => id.toString() === buildingId.toString());
      if (!isOwned) return res.status(403).json({ error: 'Access denied.' });
      activeBuildingIds = [new mongoose.Types.ObjectId(buildingId)];
    } else {
      activeBuildingIds = ownerBuildingIds;
    }

    const insights = [], alerts = [];

    const highComplaints = await Complaint.find({
      status: 'Pending',
      priority: 'High',
      buildingId: { $in: activeBuildingIds }
    });

    highComplaints.forEach(c => {
      alerts.push({
        type: 'complaint',
        message: `Critical: ${c.title}`,
        severity: 'high',
        id: c._id
      });
    });

    const pendingPayments = await Payment.countDocuments({
      status: { $in: ['Pending', 'Due'] },
      $or: [
        { buildingId: { $in: activeBuildingIds.map(id => id.toString()) } },
        { buildingId: { $in: activeBuildingIds } }
      ]
    });
    if (pendingPayments > 0) insights.push({ type: 'payment', message: `${pendingPayments} tenants have pending dues.` });

    res.json({ alerts, insights });
  } catch (error) {
    console.error('Alerts Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/dashboard/complaints ───────────────────────────────────────────
exports.getComplaintsStats = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const mongoose = require('mongoose');

    const isAdmin = req.user.role === 'SUPER_ADMIN';
    const ownerBuildings = isAdmin 
      ? await Building.find().select('_id') 
      : await Building.find({ owner: req.user.id }).select('_id');
    const ownerBuildingIds = ownerBuildings.map(b => b._id);

    let activeBuildingIds = [];
    if (buildingId) {
      const isOwned = ownerBuildingIds.some(id => id.toString() === buildingId.toString());
      if (!isOwned) return res.status(403).json({ error: 'Access denied.' });
      activeBuildingIds = [new mongoose.Types.ObjectId(buildingId)];
    } else {
      activeBuildingIds = ownerBuildingIds;
    }

    const complaints = await Complaint.find({ buildingId: { $in: activeBuildingIds } });
    const open = complaints.filter(c => c.status === 'Pending').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;

    res.json({
      total: complaints.length,
      open: complaints.filter(c => c.status === 'Pending').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length,
      highPriority: complaints.filter(c => c.priority === 'High').length,
      avgResolutionHours: 0,
      categories: [
        { name: 'Maintenance', count: complaints.filter(c => c.category === 'Maintenance').length, color: '#EF4444' },
        { name: 'Cleaning', count: complaints.filter(c => c.category === 'Cleaning').length, color: '#F59E0B' },
        { name: 'Mess', count: complaints.filter(c => c.category === 'Mess').length, color: '#8B5CF6' },
      ],
      pending24h: complaints.filter(c => c.status === 'Pending').length
    });
  } catch (error) {
    console.error('Complaints Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/dashboard/mess ─────────────────────────────────────────────────
exports.getMessStats = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const mongoose = require('mongoose');

    const isAdmin = req.user.role === 'SUPER_ADMIN';
    const ownerBuildings = isAdmin 
      ? await Building.find().select('_id') 
      : await Building.find({ owner: req.user.id }).select('_id');
    const ownerBuildingIds = ownerBuildings.map(b => b._id);

    let activeBuildingIds = [];
    if (buildingId) {
      const isOwned = ownerBuildingIds.some(id => id.toString() === buildingId.toString());
      if (!isOwned) return res.status(403).json({ error: 'Access denied.' });
      activeBuildingIds = [new mongoose.Types.ObjectId(buildingId)];
    } else {
      activeBuildingIds = ownerBuildingIds;
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[new Date().getDay()];
    const todayISO = new Date().toISOString().split('T')[0];

    const menu = await MessMenu.findOne({ buildingId: { $in: activeBuildingIds }, day, plan: 'standard' });

    // Calculate real attendance stats
    const attendance = await MessAttendance.find({ buildingId: { $in: activeBuildingIds }, date: todayISO });
    let mealsServedToday = 0;
    attendance.forEach(att => {
      if (att.breakfast) mealsServedToday++;
      if (att.lunch) mealsServedToday++;
      if (att.dinner) mealsServedToday++;
    });

    res.json({
      mealsServedToday,
      avgFoodRating: 4.5,
      dailyMessCost: mealsServedToday * 60,
      monthlyMessCost: mealsServedToday * 1800,
      menuToday: {
        breakfast: menu?.breakfast || 'N/A',
        lunch: menu?.lunch || 'N/A',
        dinner: menu?.dinner || 'N/A'
      },
      inventory: []
    });
  } catch (error) {
    console.error('Mess Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/dashboard/staff ────────────────────────────────────────────────
exports.getStaffStats = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const mongoose = require('mongoose');

    const isAdmin = req.user.role === 'SUPER_ADMIN';
    const ownerBuildings = isAdmin 
      ? await Building.find().select('_id') 
      : await Building.find({ owner: req.user.id }).select('_id');
    const ownerBuildingIds = ownerBuildings.map(b => b._id);

    let activeBuildingIds = [];
    if (buildingId) {
      const isOwned = ownerBuildingIds.some(id => id.toString() === buildingId.toString());
      if (!isOwned) return res.status(403).json({ error: 'Access denied.' });
      activeBuildingIds = [new mongoose.Types.ObjectId(buildingId)];
    } else {
      activeBuildingIds = ownerBuildingIds;
    }

    const staff = await Staff.find({ buildingId: { $in: activeBuildingIds } }).select('name role performance status');
    const efficiency = staff.length > 0 ? (staff.reduce((s, st) => s + (st.performance || 0), 0) / staff.length) * 20 : 100;

    res.json({
      totalStaff: staff.length,
      tasksAssigned: staff.reduce((s, st) => s + (st.tasks?.length || 0), 0),
      tasksCompleted: staff.reduce((s, st) => s + (st.tasks?.filter(t => t.status === 'COMPLETED').length || 0), 0),
      tasksPending: staff.reduce((s, st) => s + (st.tasks?.filter(t => t.status === 'PENDING').length || 0), 0),
      efficiencyScore: Math.round(efficiency),
      staffList: staff.map(s => ({
        name: s.name,
        role: s.role,
        score: (s.performance || 0) * 20,
        status: s.status
      }))
    });
  } catch (error) {
    console.error('Staff Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/dashboard/activity ─────────────────────────────────────────────
exports.getLiveActivity = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const mongoose = require('mongoose');
    const Building = require('../models/Building');
    const Payment = require('../models/Payment');
    const Complaint = require('../models/Complaint');
    const isAdmin = req.user.role === 'SUPER_ADMIN';

    const ownerBuildings = isAdmin
      ? await Building.find().select('_id')
      : await Building.find({ owner: req.user.id }).select('_id');
    const ownerBuildingIds = ownerBuildings.map(b => b._id);

    let activeBuildingIds = [];
    if (buildingId) {
      const isOwned = ownerBuildingIds.some(id => id.toString() === buildingId.toString());
      if (!isOwned) return res.status(403).json({ error: 'Access denied.' });
      activeBuildingIds = [new mongoose.Types.ObjectId(buildingId)];
    } else {
      activeBuildingIds = ownerBuildingIds;
    }

    const payMatch = {
      $or: [
        { buildingId: { $in: activeBuildingIds.map(id => id.toString()) } },
        { buildingId: { $in: activeBuildingIds } }
      ]
    };

    const [payments, complaints] = await Promise.all([
      Payment.find(payMatch).sort({ createdAt: -1 }).limit(10).populate('tenantId'),
      Complaint.find({ buildingId: { $in: activeBuildingIds } }).sort({ createdAt: -1 }).limit(10).populate('tenant')
    ]);

    const activity = [
      ...payments.map(p => ({
        icon: '💰',
        text: `${p.tenantId?.name || 'A Tenant'} paid ₹${(p.amount || 0).toLocaleString()} rent`,
        time: p.createdAt || p.date,
        type: 'payment'
      })),
      ...complaints.map(c => ({
        icon: c.priority === 'High' ? '⚠️' : '🔧',
        text: `${c.title} reported by ${c.tenant?.name || 'A Tenant'}`,
        time: c.createdAt || c.date,
        type: 'complaint'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

    if (activity.length === 0) {
      activity.push({ icon: '🚀', text: 'System initialized — no recent activity.', time: new Date(), type: 'system' });
    }

    res.json(activity);
  } catch (error) {
    console.error('Activity Error:', error);
    res.status(500).json({ error: error.message });
  }
};
