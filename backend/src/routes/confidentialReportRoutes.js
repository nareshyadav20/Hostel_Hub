const express = require('express');
const router = express.Router();
const auth = require('../utils/authMiddleware');
const {
  createReport,
  getAllReports,
  updateReportStatus,
  flagReport,
  deleteReport,
  hideReport,
  getMyReports
} = require('../controllers/confidentialReportController');

// Submit a new confidential report
router.post('/', auth, createReport);

// Get my reports (Tenant)
router.get('/me', auth, getMyReports);

// Debug: Get all reports without filters
router.get('/debug', async (req, res) => {
  try {
    const ConfidentialReport = require('../models/ConfidentialReport');
    const reports = await ConfidentialReport.find().lean();
    const count = await ConfidentialReport.countDocuments();
    res.json({ count, reports });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all confidential reports (with pagination and filtering)
router.get('/', auth, getAllReports);

// Update status of a specific report
router.patch('/:id/status', auth, updateReportStatus);

// Flag a specific report
router.patch('/:id/flag', auth, flagReport);

// Delete a specific report
router.delete('/:id', auth, deleteReport);

// Hide/Unhide a specific report
router.patch('/:id/hide', auth, hideReport);

module.exports = router;
