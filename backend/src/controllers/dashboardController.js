const Building = require('../models/Building');

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

// GET /api/dashboard/summary
exports.getSummaryKPIs = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const query = buildingId ? { _id: buildingId } : {};
    const buildings = await Building.find(query).populate({ path: 'floors', populate: { path: 'rooms', populate: { path: 'beds' } } });
    const { totalBeds, occupiedBeds, maintenanceRooms, buildingWise, floorWise } = traverseHierarchy(buildings);

    const vacantBeds = totalBeds - occupiedBeds;
    const occupancyRate = totalBeds > 0 ? parseFloat(((occupiedBeds / totalBeds) * 100).toFixed(1)) : 0;
    const avgRent = 6500;
    const expectedMonthlyRevenue = occupiedBeds * avgRent;
    const todayRevenue = Math.round(expectedMonthlyRevenue / 30);
    const pendingPaymentsCount = Math.max(0, Math.floor(occupiedBeds * 0.07));
    const pendingPaymentsAmount = pendingPaymentsCount * avgRent;

    // Health Score calculation
    const occupancyScore = Math.min(40, (occupancyRate / 100) * 40);
    const paymentScore = Math.max(0, 30 - (pendingPaymentsCount * 2));
    const maintenanceScore = Math.max(0, 20 - (maintenanceRooms * 3));
    const vacancyScore = Math.min(10, ((totalBeds - vacantBeds) / (totalBeds || 1)) * 10);
    const healthScore = Math.round(occupancyScore + paymentScore + maintenanceScore + vacancyScore);

    res.json({
      totalBeds, occupiedBeds, vacantBeds, occupancyRate,
      todayRevenue, expectedMonthlyRevenue,
      pendingPaymentsCount, pendingPaymentsAmount,
      maintenanceRooms, healthScore,
      buildingCount: buildings.length,
      checkInsToday: Math.floor(Math.random() * 4) + 1,
      checkOutsToday: Math.floor(Math.random() * 2) + 1,
      rentDueToday: pendingPaymentsCount,
      complaintsToday: Math.floor(Math.random() * 3),
      newTenantsThisMonth: Math.floor(occupiedBeds * 0.08),
      renewalsPending: Math.floor(occupiedBeds * 0.05),
      tenantsLeavingSoon: Math.floor(occupiedBeds * 0.03),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/dashboard/revenue
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dailyRevenue = days.map(name => ({
      name,
      expected: 13000,
      actual: Math.round(9000 + Math.random() * 7000)
    }));

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyRevenue = months.map((name, i) => ({
      name,
      revenue: Math.round(750000 + i * 95000 + Math.random() * 50000),
      expenses: Math.round(300000 + i * 20000)
    }));

    res.json({
      dailyRevenue,
      monthlyRevenue,
      rentMetrics: {
        pendingRent: 87500,
        collectedRent: 1462500,
        securityDepositsHeld: 3250000,
        totalIncome: 1550000,
        totalExpenses: 480000,
        netProfit: 1070000
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
    const buildings = await Building.find(query).populate({ path: 'floors', populate: { path: 'rooms', populate: { path: 'beds' } } });
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
    const Complaint = require('../models/Complaint');
    const Building = require('../models/Building');
    
    const query = buildingId ? { _id: buildingId } : {};
    const buildings = await Building.find(query).populate({ path: 'floors', populate: { path: 'rooms', populate: { path: 'beds' } } });
    const { totalBeds, vacantBeds, occupancyRate, maintenanceRooms } = traverseHierarchy(buildings);
    
    const insights = [], alerts = [];

    // Real high priority complaints
    const complaintQuery = buildingId ? { buildingId, status: 'Pending', priority: 'High' } : { status: 'Pending', priority: 'High' };
    const highComplaints = await Complaint.find(complaintQuery).populate('buildingId', 'name');
    
    highComplaints.forEach(c => {
      alerts.push({ 
        type: 'complaint', 
        message: `High Priority: ${c.title}${c.buildingId ? ' at ' + c.buildingId.name : ''}`, 
        severity: 'high',
        id: c._id
      });
    });

    if (vacantBeds > 5) insights.push({ type: 'vacancy', message: `${vacantBeds} beds vacant — consider a promotional campaign to improve occupancy.` });
    if (occupancyRate < 70) insights.push({ type: 'revenue', message: 'Low occupancy is impacting monthly revenue. Review pricing or marketing.' });
    if (maintenanceRooms > 0) alerts.push({ type: 'maintenance', message: `${maintenanceRooms} rooms currently in maintenance mode.`, severity: 'medium' });

    // Mock/Static for now but could be wired to other models
    insights.push({ type: 'payment', message: '7 tenants have pending rent past the due date. Send reminder notices.' });
    alerts.push({ type: 'stock', message: 'Rice stock at 15% — reorder required.', severity: 'high' });

    res.json({ alerts, insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/dashboard/complaints
exports.getComplaintsStats = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const Complaint = require('../models/Complaint');
    const query = buildingId ? { buildingId } : {};
    
    const complaints = await Complaint.find(query);
    const open = complaints.filter(c => c.status === 'Pending').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const high = complaints.filter(c => ['Electrical', 'Plumbing'].includes(c.category)).length;

    res.json({
      total: complaints.length,
      open,
      resolved,
      highPriority: high,
      avgResolutionHours: 4.2,
      categories: [
        { name: 'Maintenance', count: complaints.filter(c => !['Leave', 'Visitor'].includes(c.category)).length, color: '#EF4444' },
        { name: 'Leave', count: complaints.filter(c => c.category === 'Leave').length, color: '#F59E0B' },
        { name: 'Visitor', count: complaints.filter(c => c.category === 'Visitor').length, color: '#8B5CF6' },
      ],
      pending24h: Math.min(open, 3)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/dashboard/mess
exports.getMessStats = async (req, res) => {
  try {
    res.json({
      mealsServedToday: 187,
      avgFoodRating: 3.8,
      dailyMessCost: 14500,
      monthlyMessCost: 435000,
      menuToday: {
        breakfast: 'Idli Sambar, Tea',
        lunch: 'Rice, Dal, Sabzi, Roti',
        dinner: 'Chapati, Paneer Curry, Salad'
      },
      mealTrend: [
        { name: 'Mon', served: 180 }, { name: 'Tue', served: 192 },
        { name: 'Wed', served: 175 }, { name: 'Thu', served: 188 },
        { name: 'Fri', served: 195 }, { name: 'Sat', served: 160 },
        { name: 'Sun', served: 145 },
      ],
      inventory: [
        { item: 'Rice', stock: 15, unit: 'kg', alert: true },
        { item: 'Dal', stock: 40, unit: 'kg', alert: false },
        { item: 'Vegetables', stock: 25, unit: 'kg', alert: false },
        { item: 'Cooking Oil', stock: 8, unit: 'L', alert: true },
      ],
      foodComplaints: { total: 12, quality: 5, hygiene: 3, quantity: 2, delay: 2 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/dashboard/staff
exports.getStaffStats = async (req, res) => {
  try {
    res.json({
      totalStaff: 8,
      tasksAssigned: 34,
      tasksCompleted: 28,
      tasksPending: 6,
      avgResolutionHours: 3.1,
      efficiencyScore: Math.round((28 / 34) * 100),
      staffList: [
        { name: 'Ramesh Kumar', role: 'Maintenance', score: 95, tasks: 10 },
        { name: 'Suresh Babu', role: 'Cleaning', score: 88, tasks: 8 },
        { name: 'Pradeep Singh', role: 'Security', score: 72, tasks: 7 },
        { name: 'Anitha Devi', role: 'Mess', score: 65, tasks: 9 },
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
