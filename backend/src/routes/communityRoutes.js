const express = require('express');
const router = express.Router();
const CommunityReport = require('../models/tenant/CommunityReport');
const SosAlert = require('../models/SosAlert');
const Building = require('../models/Building');
const authMiddleware = require('../utils/authMiddleware');

// All community routes require authentication
router.use(authMiddleware);

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

    const alerts = await SosAlert.find(query).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resolve SOS Alert
router.patch('/sos/:id/resolve', async (req, res) => {
  try {
    const alert = await SosAlert.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, { new: true });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dispatch SOS Alert (Mock action)
router.patch('/sos/:id/dispatch', async (req, res) => {
  try {
    const alert = await SosAlert.findById(req.params.id);
    // In a real app, this would trigger an SMS/Push to emergency services
    res.json({ message: 'Dispatch signal sent', alert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Lost & Found Status
router.patch('/lost-found/:id/status', async (req, res) => {
  try {
    const report = await CommunityReport.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
