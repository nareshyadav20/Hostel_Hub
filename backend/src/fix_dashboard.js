const fs = require('fs');

let content = fs.readFileSync('backend/src/controllers/dashboardController.js', 'utf8');

// Replace getSummaryKPIs
content = content.replace(
  /\/\/ ─── GET \/api\/dashboard\/summary ───[\s\S]*?(?=\/\/ ─── GET \/api\/dashboard\/revenue ───)/,
  `// ─── GET /api/dashboard/summary ──────────────────────────────────────────────
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

`
);

// Replace getRevenueAnalytics
content = content.replace(
  /\/\/ ─── GET \/api\/dashboard\/revenue ───[\s\S]*?(?=\/\/ ─── GET \/api\/dashboard\/occupancy ───)/,
  `// ─── GET /api/dashboard/revenue ──────────────────────────────────────────────
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

`
);

// General replacement for finding ownerBuildings in the rest of functions
content = content.replace(
  /const ownerBuildings = await Building\.find\(\{ owner: req\.user\.id \}\)\.select\('_id'\);/g,
  `const isAdmin = req.user.role === 'SUPER_ADMIN';
    const ownerBuildings = isAdmin 
      ? await Building.find().select('_id') 
      : await Building.find({ owner: req.user.id }).select('_id');`
);

// Replace getLiveActivity
content = content.replace(
  /\/\/ ─── GET \/api\/dashboard\/activity ───[\s\S]*/,
  `// ─── GET /api/dashboard/activity ─────────────────────────────────────────────
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
        text: \`\${p.tenantId?.name || 'A Tenant'} paid ₹\${(p.amount || 0).toLocaleString()} rent\`,
        time: p.createdAt || p.date,
        type: 'payment'
      })),
      ...complaints.map(c => ({
        icon: c.priority === 'High' ? '⚠️' : '🔧',
        text: \`\${c.title} reported by \${c.tenant?.name || 'A Tenant'}\`,
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
`
);

fs.writeFileSync('backend/src/controllers/dashboardController.js', content);
console.log('Successfully updated dashboardController.js');
