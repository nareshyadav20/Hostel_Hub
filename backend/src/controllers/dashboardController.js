const Building = require('../models/Building');
const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const SystemSettings = require('../models/SystemSettings');

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

// GET /api/dashboard/summary
exports.getSummaryKPIs = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const query = buildingId ? { _id: buildingId } : {};
    
    // 1. Fetch Hierarchy Data
    const buildings = await Building.find(query).populate({ 
      path: 'floors', 
      populate: { path: 'rooms', populate: { path: 'beds' } } 
    });
    
    const { totalBeds, occupiedBeds, maintenanceRooms, buildingWise } = traverseHierarchy(buildings);
    const vacantBeds = totalBeds - occupiedBeds;
    const occupancyRate = totalBeds > 0 ? parseFloat(((occupiedBeds / totalBeds) * 100).toFixed(1)) : 0;

    // 2. Real Tenant Count
    const totalTenants = await Tenant.countDocuments(buildingId ? { buildingId } : {});

    // 3. Real Payment Stats
    const payments = await Payment.find(buildingId ? { buildingId } : {});
    const pendingPayments = payments.filter(p => p.status === 'Pending' || p.status === 'Due');
    const todayRevenue = payments
      .filter(p => new Date(p.date).toDateString() === new Date().toDateString() && p.status === 'Paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const pendingPaymentsCount = pendingPayments.length;
    const pendingPaymentsAmount = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // 4. Health Score (Dynamic)
    const settings = await SystemSettings.findOne({ owner: req.user.id });
    const defaultRent = settings ? settings.rentSettings.defaultRent.single : 8000;

    const occupancyScore = Math.min(40, (occupancyRate / 100) * 40);
    const paymentScore = Math.max(0, 30 - (pendingPaymentsCount * 1.5));
    const maintenanceScore = Math.max(0, 20 - (maintenanceRooms * 2));
    const healthScore = Math.round(occupancyScore + paymentScore + maintenanceScore + 10);

    // 5. Daily Activity Stats
    const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
    const complaintsToday = await Complaint.countDocuments({ 
      createdAt: { $gte: startOfDay },
      ...(buildingId && { buildingId })
    });

    res.json({
      totalBeds, occupiedBeds, vacantBeds, occupancyRate,
      todayRevenue, 
      expectedMonthlyRevenue: totalTenants * defaultRent, 
      pendingPaymentsCount, pendingPaymentsAmount,
      maintenanceRooms, healthScore,
      buildingCount: buildings.length,
      totalTenants,
      renewalsPending: 0,
      pendingKYC: 0,
      tenantsLeavingSoon: 0,
      newTenantsThisMonth: 0,
      checkInsToday: 0,
      checkOutsToday: 0,
      rentDueToday: pendingPaymentsCount,
      complaintsToday,
      buildingName: buildings.length === 1 ? buildings[0].name : 'All Properties'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/dashboard/revenue
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const payments = await Payment.find(buildingId ? { buildingId } : {});
    
    // Last 7 days daily revenue
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyRevenue = days.map((name, i) => {
      const dayPayments = payments.filter(p => new Date(p.date).getDay() === i && p.status === 'Paid');
      return {
        name,
        expected: 10000,
        actual: dayPayments.reduce((sum, p) => sum + p.amount, 0)
      };
    });

    const collectedRent = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingRent = payments.filter(p => p.status === 'Pending' || p.status === 'Due').reduce((sum, p) => sum + p.amount, 0);

    res.json({
      dailyRevenue,
      monthlyRevenue: [
        { name: 'Prev', revenue: collectedRent * 0.8, expenses: collectedRent * 0.2 },
        { name: 'Current', revenue: collectedRent, expenses: collectedRent * 0.25 }
      ],
      rentMetrics: {
        pendingRent,
        collectedRent,
        securityDepositsHeld: (await Tenant.countDocuments()) * 10000,
        totalIncome: collectedRent,
        totalExpenses: collectedRent * 0.25,
        netProfit: collectedRent * 0.75
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/dashboard/occupancy
exports.getOccupancyStats = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const query = buildingId ? { _id: buildingId } : {};
    const buildings = await Building.find(query).populate({ 
      path: 'floors', 
      populate: { path: 'rooms', populate: { path: 'beds' } } 
    });
    const { buildingWise, floorWise } = traverseHierarchy(buildings);
    res.json({ buildingWise, floorWise });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/dashboard/alerts
exports.getAlertsAndInsights = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const insights = [], alerts = [];

    const highComplaints = await Complaint.find({ 
      status: 'Pending', 
      priority: 'High',
      ...(buildingId && { buildingId })
    });
    
    highComplaints.forEach(c => {
      alerts.push({ 
        type: 'complaint', 
        message: `Critical: ${c.title}`, 
        severity: 'high',
        id: c._id
      });
    });

    const pendingPayments = await Payment.countDocuments({ status: { $in: ['Pending', 'Due'] } });
    if (pendingPayments > 0) insights.push({ type: 'payment', message: `${pendingPayments} tenants have pending dues.` });

    res.json({ alerts, insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/dashboard/complaints
exports.getComplaintsStats = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const query = buildingId ? { buildingId } : {};
    
    const complaints = await Complaint.find(query);
    const open = complaints.filter(c => c.status === 'Pending').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;

    res.json({
      total: complaints.length,
      open,
      resolved,
      highPriority: complaints.filter(c => c.priority === 'High').length,
      avgResolutionHours: 0,
      categories: [
        { name: 'Maintenance', count: complaints.filter(c => c.category === 'Maintenance').length, color: '#EF4444' },
        { name: 'Cleaning', count: complaints.filter(c => c.category === 'Cleaning').length, color: '#F59E0B' },
        { name: 'Mess', count: complaints.filter(c => c.category === 'Mess').length, color: '#8B5CF6' },
      ],
      pending24h: open
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/dashboard/mess
exports.getMessStats = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[new Date().getDay()];
    const todayISO = new Date().toISOString().split('T')[0];

    const menu = await MessMenu.findOne({ buildingId, day, plan: 'standard' });
    
    // Calculate real attendance stats
    const attendance = await MessAttendance.find({ buildingId, date: todayISO });
    let mealsServedToday = 0;
    attendance.forEach(att => {
      if (att.breakfast) mealsServedToday++;
      if (att.lunch) mealsServedToday++;
      if (att.dinner) mealsServedToday++;
    });

    res.json({
      mealsServedToday,
      avgFoodRating: 4.5,
      dailyMessCost: mealsServedToday * 60, // Dummy cost calculation
      monthlyMessCost: mealsServedToday * 1800, // Dummy
      menuToday: {
        breakfast: menu?.breakfast || 'N/A',
        lunch: menu?.lunch || 'N/A',
        dinner: menu?.dinner || 'N/A'
      },
      inventory: []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/dashboard/staff
exports.getStaffStats = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ['STAFF', 'WARDEN'] } }).select('name role');
    res.json({
      totalStaff: staff.length,
      tasksAssigned: 0,
      tasksCompleted: 0,
      tasksPending: 0,
      efficiencyScore: 100,
      staffList: staff.map(s => ({ name: s.name, role: s.role, score: 100 }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/dashboard/activity
exports.getLiveActivity = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const query = buildingId ? { buildingId } : {};

    const [payments, complaints] = await Promise.all([
      Payment.find(query).sort({ createdAt: -1 }).limit(5).populate('tenantId'),
      Complaint.find(query).sort({ createdAt: -1 }).limit(5).populate('tenant')
    ]);

    const activity = [
      ...payments.map(p => ({
        icon: '💰',
        text: `${p.tenantId?.name || 'Tenant'} paid ₹${p.amount} rent`,
        time: p.createdAt,
        type: 'payment'
      })),
      ...complaints.map(c => ({
        icon: c.priority === 'High' ? '⚠️' : '🔧',
        text: `${c.title} reported by ${c.tenant?.name || 'Tenant'}`,
        time: c.createdAt,
        type: 'complaint'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

    if (activity.length === 0) {
      activity.push({
        icon: '🚀',
        text: 'Dashboard system initialized',
        time: new Date(),
        type: 'system'
      });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

