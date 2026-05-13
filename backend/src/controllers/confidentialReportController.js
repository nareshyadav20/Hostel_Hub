const ConfidentialReport = require('../models/ConfidentialReport');
const socketService = require('../utils/socketService');

// POST /api/confidential-reports — submit a new report
const createReport = async (req, res) => {
  try {
    const { title, description, category, priority, submittedBy, classification, location } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Description is required.' });
    }

    const report = new ConfidentialReport({
      title: title || 'Confidential Report',
      description,
      category: category || 'General',
      classification: classification || 'Other Concern',
      location: location || 'N/A',
      priority: priority || 'Medium',
      submittedBy: submittedBy || 'Tenant',
      user: req.body.userId,
      tenant: req.body.tenantId
    });

    const saved = await report.save();
    
    // Real-time notification for owner
    socketService.emitToOwner('confidentialReportCreated', saved);
    
    res.status(201).json({ message: 'Report submitted successfully.', report: saved });
  } catch (err) {
    console.error('Error creating confidential report:', err);
    res.status(500).json({ message: 'Server error while saving report.' });
  }
};

// GET /api/confidential-reports — fetch all reports (owner/admin only)
const getAllReports = async (req, res) => {
  try {
    const reports = await ConfidentialReport.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    console.error('Error fetching confidential reports:', err);
    res.status(500).json({ message: 'Server error while fetching reports.' });
  }
};

// PATCH /api/confidential-reports/:id/status — update report status
const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await ConfidentialReport.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.status(200).json({ message: 'Status updated.', report });

    // Real-time notification for tenant
    if (report.tenant) {
      socketService.emitToOwner('confidentialReportUpdated', report); // Emit globally for now
    }
  } catch (err) {
    console.error('Error updating report status:', err);
    res.status(500).json({ message: 'Server error while updating status.' });
  }
};

module.exports = { createReport, getAllReports, updateReportStatus };
