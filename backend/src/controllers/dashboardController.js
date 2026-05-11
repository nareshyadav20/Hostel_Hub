const mongoose = require('mongoose');
const Building = require('../models/Building');
const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
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

  const floors = await db.collection('owner_floors').find(
    { buildingId: { $in: buildingIds } }
  ).toArray();
  const floorIds = floors.map(f => f._id);

  const rooms = floorIds.length > 0
    ? await db.collection('owner_rooms').find({ floor: { $in: floorIds } }).toArray()
    : [];
  const roomIds = rooms.map(r => r._id);
  const maintenanceRoomsCount = rooms.filter(r => r.status === 'Maintenance').length;

  const totalBeds = roomIds.length > 0
    ? await db.collection('owner_beds').countDocuments({ roomId: { $in: roomIds } })
    : 0;
  const occupiedBeds = roomIds.length > 0
    ? await db.collection('owner_beds').countDocuments({ roomId: { $in: roomIds }, status: 'OCCUPIED' })
    : 0;

  return { totalBeds, occupiedBeds, maintenanceRoomsCount, rooms, floorIds };
};

// ─── GET /api/dashboard/summary ──────────────────────────────────────────────
exports.getSummaryKPIs = async (req, res) => {
  try {
    const oid = parseId(req.query.buildingId);

    const allBuildings = await Building.find(oid ? { _id: oid } : {}, '_id');
    const buildingIds = allBuildings.map(b => b._id);
    const buildingCount = buildingIds.length;

    const { totalBeds, occupiedBeds, maintenanceRoomsCount } = await getHierarchyCounts(buildingIds);
    const vacantBeds = totalBeds - occupiedBeds;
    const occupancyRate = totalBeds > 0 ? parseFloat(((occupiedBeds / totalBeds) * 100).toFixed(1)) : 0;

    const totalTenants = await Tenant.countDocuments(oid ? { buildingId: oid } : {});

    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

    const paymentStats = await Payment.aggregate([
      { $match: oid ? { buildingId: oid } : {} },
      {
        $group: {
          _id: null,
          pendingCount: { $sum: { $cond: [{ $in: ['$status', ['Pending', 'Due']] }, 1, 0] } },
          pendingAmount: { $sum: { $cond: [{ $in: ['$status', ['Pending', 'Due']] }, '$amount', 0] } },
          todayRevenue: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$status', 'Paid'] },
                  { $gte: ['$date', startOfDay] },
                  { $lte: ['$date', endOfDay] }
                ]},
                '$amount', 0
              ]
            }
          }
        }
      }
    ]);
    const ps = paymentStats[0] || { pendingCount: 0, pendingAmount: 0, todayRevenue: 0 };

    const complaintsToday = await Complaint.countDocuments({
      createdAt: { $gte: startOfDay },
      ...(oid && { buildingId: oid })
    });

    const checkinsToday = await Tenant.countDocuments({
      createdAt: { $gte: startOfDay },
      ...(oid && { buildingId: oid })
    });

    res.json({
      totalBeds, occupiedBeds, vacantBeds, occupancyRate,
      todayRevenue: ps.todayRevenue,
      expectedMonthlyRevenue: totalTenants * 8000,
      pendingPaymentsCount: ps.pendingCount,
      pendingPaymentsAmount: ps.pendingAmount,
      maintenanceRooms: maintenanceRoomsCount,
      healthScore: 85,
      buildingCount,
      totalTenants,
      complaintsToday,
      checkinsToday,
      checkoutsToday: 0, // Placeholder
      newBookingsToday: checkinsToday, // Simplified
      buildingName: oid ? 'Selected Property' : 'All Properties'
    });
  } catch (error) {
    console.error('Summary Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/dashboard/revenue ──────────────────────────────────────────────
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const oid = parseId(req.query.buildingId);
    const payments = await Payment.find(oid ? { buildingId: oid } : {});

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyRevenue = days.map((name, i) => {
      const dayPayments = payments.filter(p => new Date(p.date).getDay() === i && p.status === 'Paid');
      return { name, expected: 10000, actual: dayPayments.reduce((sum, p) => sum + p.amount, 0) };
    });

    const collectedRent = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingRent = payments.filter(p => ['Pending', 'Due'].includes(p.status)).reduce((sum, p) => sum + p.amount, 0);
    const tenantCount = await Tenant.countDocuments(oid ? { buildingId: oid } : {});

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
    const oid = parseId(req.query.buildingId);
    const db = mongoose.connection.db;

    const buildings = await Building.find(oid ? { _id: oid } : {}, '_id name').lean();
    const buildingIds = buildings.map(b => b._id);

    const floors = await db.collection('owner_floors').find(
      { buildingId: { $in: buildingIds } }
    ).toArray();
    const floorIds = floors.map(f => f._id);

    const rooms = floorIds.length > 0
      ? await db.collection('owner_rooms').find({ floor: { $in: floorIds } }).toArray()
      : [];
    const roomIds = rooms.map(r => r._id);

    const beds = roomIds.length > 0
      ? await db.collection('owner_beds').find({ roomId: { $in: roomIds } }).toArray()
      : [];

    // Per-building stats
    const buildingWise = buildings.map(b => {
      const bFloors = floors.filter(f => String(f.buildingId) === String(b._id));
      const bFloorIds = bFloors.map(f => String(f._id));
      const bRooms = rooms.filter(r => bFloorIds.includes(String(r.floor)));
      const bRoomIds = bRooms.map(r => String(r._id));
      const bBeds = beds.filter(bed => bRoomIds.includes(String(bed.roomId)));
      const occupied = bBeds.filter(bed => bed.status === 'OCCUPIED').length;
      return { name: b.name, total: bBeds.length, occupied, vacant: bBeds.length - occupied };
    });

    // Per-floor stats
    const floorWise = floors.map(f => {
      const fBuilding = buildings.find(b => String(b._id) === String(f.buildingId));
      const fRooms = rooms.filter(r => String(r.floor) === String(f._id));
      const fRoomIds = fRooms.map(r => String(r._id));
      const fBeds = beds.filter(bed => fRoomIds.includes(String(bed.roomId)));
      const occupied = fBeds.filter(bed => bed.status === 'OCCUPIED').length;
      return {
        name: `${fBuilding?.name || 'B'} F${f.floorNumber}`,
        total: fBeds.length, occupied, vacant: fBeds.length - occupied
      };
    });

    res.json({ buildingWise, floorWise });
  } catch (error) {
    console.error('Occupancy Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/dashboard/alerts ───────────────────────────────────────────────
exports.getAlertsAndInsights = async (req, res) => {
  try {
    const oid = parseId(req.query.buildingId);
    const insights = [], alerts = [];

    const highComplaints = await Complaint.find({
      status: 'Pending',
      priority: 'High',
      ...(oid && { buildingId: oid })
    });

    highComplaints.forEach(c => {
      alerts.push({ type: 'complaint', message: `Critical: ${c.title}`, severity: 'high', id: c._id });
    });

    const pendingPayments = await Payment.countDocuments({
      status: { $in: ['Pending', 'Due'] },
      ...(oid && { buildingId: oid })
    });
    if (pendingPayments > 0) {
      insights.push({ type: 'payment', message: `${pendingPayments} tenants have pending dues.` });
    }

    res.json({ alerts, insights });
  } catch (error) {
    console.error('Alerts Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/dashboard/complaints ───────────────────────────────────────────
exports.getComplaintsStats = async (req, res) => {
  try {
    const oid = parseId(req.query.buildingId);
    const query = oid ? { buildingId: oid } : {};
    const complaints = await Complaint.find(query).lean();

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
    const oid = parseId(req.query.buildingId);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[new Date().getDay()];
    const todayISO = new Date().toISOString().split('T')[0];

    const menu = await MessMenu.findOne({
      ...(oid && { buildingId: oid }),
      day,
      plan: 'standard'
    });

    const attendance = await MessAttendance.find({
      ...(oid && { buildingId: oid }),
      date: todayISO
    });
    const mealsServedToday = attendance.reduce((sum, a) => {
      return sum + (a.breakfast ? 1 : 0) + (a.lunch ? 1 : 0) + (a.dinner ? 1 : 0);
    }, 0);

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
    const staff = await User.find({ role: { $in: ['STAFF', 'WARDEN'] } }, 'name role').lean();
    res.json({
      totalStaff: staff.length,
      tasksAssigned: 0,
      tasksCompleted: 0,
      tasksPending: 0,
      efficiencyScore: 100,
      staffList: staff.map(s => ({ name: s.name, role: s.role, score: 100 }))
    });
  } catch (error) {
    console.error('Staff Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/dashboard/activity ─────────────────────────────────────────────
exports.getLiveActivity = async (req, res) => {
  try {
    const oid = parseId(req.query.buildingId);
    const query = oid ? { buildingId: oid } : {};

    const [payments, complaints] = await Promise.all([
      Payment.find(query).sort({ createdAt: -1 }).limit(5).populate('tenantId', 'name').lean(),
      Complaint.find(query).sort({ createdAt: -1 }).limit(5).populate('tenant', 'name').lean()
    ]);

    const activity = [
      ...payments.map(p => ({
        icon: '💰',
        text: `${p.tenantId?.name || 'A Tenant'} paid ₹${p.amount?.toLocaleString()} rent`,
        time: p.createdAt,
        type: 'payment'
      })),
      ...complaints.map(c => ({
        icon: c.priority === 'High' ? '⚠️' : '🔧',
        text: `${c.title} reported by ${c.tenant?.name || 'A Tenant'}`,
        time: c.createdAt,
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
