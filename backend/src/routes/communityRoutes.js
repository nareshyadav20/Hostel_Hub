const express = require('express');
const router = express.Router();
const CommunityReport = require('../models/tenant/CommunityReport');
const SOSAlert = require('../models/SOSAlert');

// Get all community reports (Lost & Found)
router.get('/lost-found', async (req, res) => {
  try {
    const reports = await CommunityReport.find().populate('user', 'name').sort({ createdAt: -1 });
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
    const alerts = await SOSAlert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
