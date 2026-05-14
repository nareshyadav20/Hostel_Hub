const express = require('express');
const router = express.Router();
const CommunityReport = require('../models/tenant/CommunityReport');
const SOSAlert = require('../models/SosAlert');
const Building = require('../models/Building');

// Get all community reports (Lost & Found)
router.get('/lost-found', async (req, res) => {
  try {
    const query = {};
    if (req.user) {
      const ownerBuildings = await Building.find({ owner: req.user._id }, '_id').lean();
      const ownerBuildingIds = ownerBuildings.map(b => b._id);
      if (ownerBuildingIds.length > 0) {
        query.buildingId = { $in: ownerBuildingIds };
      }
    }

    const reports = await CommunityReport.find(query).populate('user', 'name').sort({ createdAt: -1 });
    // Transform to include reportedBy for UI compatibility
    const transformed = reports.map(r => ({
      ...r.toObject(),
      reportedBy: r.user?.name || 'Resident'
    }));
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all SOS alerts
router.get('/sos', async (req, res) => {
  try {
    const query = {};
    if (req.user) {
      const ownerBuildings = await Building.find({ owner: req.user._id }, '_id').lean();
      const ownerBuildingIds = ownerBuildings.map(b => b._id);
      if (ownerBuildingIds.length > 0) {
        query.buildingId = { $in: ownerBuildingIds };
      }
    }

    const alerts = await SOSAlert.find(query).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resolve SOS Alert
router.patch('/sos/:id/resolve', async (req, res) => {
  try {
    const alert = await SOSAlert.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, { new: true });
    
    // Notify tenant
    const notificationService = require('../utils/notificationService');
    await notificationService.createNotification({
      portalType: 'Tenant',
      moduleName: 'Security',
      category: 'SOS',
      title: 'SOS Alert Resolved',
      message: 'Your SOS alert has been marked as resolved by the security team.',
      priority: 'Low',
      type: 'success',
      buildingId: alert.buildingId,
      tenantId: alert.tenant,
      actionLink: '/safety'
    });

    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dispatch SOS Alert (Mock action)
router.patch('/sos/:id/dispatch', async (req, res) => {
  try {
    const alert = await SOSAlert.findById(req.params.id);
    
    // Notify tenant
    const notificationService = require('../utils/notificationService');
    await notificationService.createNotification({
      portalType: 'Tenant',
      moduleName: 'Security',
      category: 'SOS',
      title: 'Emergency Help Dispatched',
      message: 'A security team has been dispatched to your location. Stay calm.',
      priority: 'High',
      type: 'error',
      buildingId: alert.buildingId,
      tenantId: alert.tenant,
      actionLink: '/safety'
    });

    res.json({ message: 'Dispatch signal sent', alert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Lost & Found Status
router.patch('/lost-found/:id/status', async (req, res) => {
  try {
    const report = await CommunityReport.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    
    // Notify tenant
    const notificationService = require('../utils/notificationService');
    await notificationService.createNotification({
      portalType: 'Tenant',
      moduleName: 'Community',
      category: 'Lost & Found',
      title: 'Item Report Updated',
      message: `Your report for "${report.title || report.item}" is now marked as ${req.body.status}.`,
      priority: 'Medium',
      type: 'info',
      buildingId: report.buildingId,
      tenantId: report.tenant,
      actionLink: '/community'
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
