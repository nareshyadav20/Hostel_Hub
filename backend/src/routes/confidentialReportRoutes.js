const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReports,
  updateReportStatus,
} = require('../controllers/confidentialReportController');

// Submit a new confidential report (Staff portal)
router.post('/', createReport);

// Get all confidential reports (Owner / Admin portal)
router.get('/', getAllReports);

// Update status of a specific report
router.patch('/:id/status', updateReportStatus);

module.exports = router;
