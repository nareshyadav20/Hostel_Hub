const ConfidentialReport = require('../models/ConfidentialReport');
const socketService = require('../utils/socketService');

// POST /api/confidential-reports — submit a new report (Tenant)
const createReport = async (req, res) => {
  try {
    let { 
      title, 
      description, 
      category, 
      priority, 
      submittedBy, 
      classification, 
      location, 
      buildingId,
      userId,
      tenantId 
    } = req.body;

    // If missing, try to get from tenant profile (for Safety.jsx)
    if (!buildingId || !tenantId) {
      const Tenant = require('../models/Tenant');
      const tenant = await Tenant.findOne({ email: req.user.email });
      if (tenant) {
        buildingId = buildingId || tenant.buildingId;
        tenantId = tenantId || tenant._id;
      }
    }

    if (!description || !buildingId) {
      return res.status(400).json({ message: 'Description and Building ID are required.' });
    }

    const report = new ConfidentialReport({
      title: title || `${classification || 'Confidential'} Report`,
      description,
      category: category || 'General',
      classification: classification || 'Other Concern',
      location: location || 'N/A',
      priority: priority || 'Medium',
      submittedBy: submittedBy || 'Tenant',
      user: userId || req.user?.id || req.user?._id,
      tenant: tenantId,
      building: buildingId
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
    const { page = 1, limit = 10, search, category, priority, status, includeHidden = 'false' } = req.query;

    const query = {};
    
    // Don't filter by building — owner sees all reports in the system.
    // Building-level filtering is enforced at the tenant submission level.
    if (includeHidden !== 'true') query.isHidden = { $ne: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { classification: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const reports = await ConfidentialReport.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('tenant', 'name roomNumber');

    const total = await ConfidentialReport.countDocuments(query);

    res.status(200).json({
      reports,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
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

    socketService.emitToOwner('confidentialReportUpdated', report);
    
    // Create notification for tenant
    const notificationService = require('../utils/notificationService');
    await notificationService.createNotification({
      moduleName: 'Safety',
      portalType: 'Tenant',
      category: 'Confidential Report',
      title: 'Report Status Updated',
      message: `Your confidential report "${report.title}" is now ${status}.`,
      priority: 'Medium',
      type: 'info',
      buildingId: report.building,
      tenantId: report.tenant,
      createdBy: req.user.id,
      actionLink: '/safety'
    });

    res.status(200).json({ message: 'Status updated.', report });
  } catch (err) {
    console.error('Error updating report status:', err);
    res.status(500).json({ message: 'Server error while updating status.' });
  }
};

// PATCH /api/confidential-reports/:id/flag — flag/unflag report
const flagReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFlagged, flagStatus } = req.body;

    const report = await ConfidentialReport.findByIdAndUpdate(
      id,
      { 
        isFlagged: isFlagged !== undefined ? isFlagged : true,
        flagStatus: flagStatus || 'Flagged'
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    socketService.emitToOwner('confidentialReportUpdated', report);
    
    res.status(200).json({ message: 'Report flagged successfully.', report });
  } catch (err) {
    console.error('Error flagging report:', err);
    res.status(500).json({ message: 'Server error while flagging report.' });
  }
};

// DELETE /api/confidential-reports/:id — delete report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await ConfidentialReport.findByIdAndDelete(id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    socketService.emitToOwner('confidentialReportDeleted', { id });
    
    res.status(200).json({ message: 'Report deleted successfully.' });
  } catch (err) {
    console.error('Error deleting report:', err);
    res.status(500).json({ message: 'Server error while deleting report.' });
  }
};

// PATCH /api/confidential-reports/:id/hide — hide/unhide report
const hideReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { isHidden } = req.body;

    const report = await ConfidentialReport.findByIdAndUpdate(
      id,
      { isHidden: isHidden !== undefined ? isHidden : true },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    socketService.emitToOwner('confidentialReportUpdated', report);
    
    res.status(200).json({ message: isHidden ? 'Report hidden.' : 'Report restored.', report });
  } catch (err) {
    console.error('Error hiding report:', err);
    res.status(500).json({ message: 'Server error while hiding report.' });
  }
};

// GET /api/confidential-reports/me — fetch reports for the logged-in tenant
const getMyReports = async (req, res) => {
  try {
    const Tenant = require('../models/Tenant');
    const tenant = await Tenant.findOne({ email: req.user.email });
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant profile not found.' });
    }

    const reports = await ConfidentialReport.find({ tenant: tenant._id }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    console.error('Error fetching my reports:', err);
    res.status(500).json({ message: 'Server error while fetching your reports.' });
  }
};

module.exports = { 
  createReport, 
  getAllReports, 
  updateReportStatus,
  flagReport,
  deleteReport,
  hideReport,
  getMyReports
};
