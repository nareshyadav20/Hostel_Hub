const Payment = require('../models/Payment');
const Tenant = require('../models/Tenant');
const Building = require('../models/Building');
const socketService = require('../utils/socketService');
const notificationService = require('../utils/notificationService');

const createPayment = async (req, res) => {
  try {
    const { tenantId, amount, type, method, buildingId, category, status, month } = req.body;

    // Generate simple invoice ID
    const invoice = `INV-${Date.now().toString().slice(-6)}`;

    const payment = new Payment({
      tenantId,
      amount,
      type,
      method: method || 'UPI',
      buildingId,
      category: category || 'Standard',
      status: status || 'Paid',
      invoice,
      month: month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    });

    await payment.save();

    // Populate before sending back
    const populated = await Payment.findById(payment._id).populate('tenantId');

    // Real-time updates
    socketService.emitUpdate(buildingId, 'paymentAdded', populated);
    socketService.emitUpdate(buildingId, 'dashboardStatsUpdated', {});

    // Notification for Tenant
    await notificationService.createNotification({
      portalType: 'Tenant',
      moduleName: 'Payments',
      category: 'Rent',
      title: 'Payment Received',
      message: `We've received your payment of ₹${amount} for ${month || 'this month'}.`,
      priority: 'Low',
      type: 'success',
      buildingId,
      tenantId,
      actionLink: '/payments'
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // 1. Get all buildings owned by this user
    const buildings = await Building.find({ owner: ownerId });
    const buildingIds = buildings.map(b => b._id);

    // 2. If specific buildingId is requested, validate ownership
    const { buildingId } = req.query;
    let query;
    if (buildingId) {
      const isOwned = buildingIds.some(id => id.toString() === buildingId);
      if (!isOwned) return res.status(403).json({ error: 'Access denied to this building.' });
      query = { buildingId };
    } else {
      query = { buildingId: { $in: buildingIds } };
    }

    // 3. Find payments scoped to the query
    const payments = await Payment.find(query)
      .populate({ path: 'tenantId', select: 'name room' })
      .sort({ date: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const tenantId = req.query.tenantId || req.user.id;
    const payments = await Payment.find({ tenantId }).sort({ date: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('tenantId');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Real-time updates
    socketService.emitUpdate(payment.buildingId, 'paymentUpdated', payment);
    socketService.emitUpdate(payment.buildingId, 'dashboardStatsUpdated', {});

    // Notification for Tenant on status change
    await notificationService.createNotification({
      portalType: 'Tenant',
      moduleName: 'Payments',
      category: 'Rent',
      title: 'Payment Status Updated',
      message: `Your payment of ₹${payment.amount} is now ${req.body.status}.`,
      priority: 'Medium',
      type: req.body.status === 'Paid' ? 'success' : 'info',
      buildingId: payment.buildingId,
      tenantId: payment.tenantId?._id || payment.tenantId,
      actionLink: '/payments'
    });

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendPaymentReminders = async (req, res) => {
  try {
    const { buildingId, dueDate, amount, month } = req.body;
    if (!buildingId) return res.status(400).json({ message: 'buildingId is required' });

    // In a real system, we'd loop through tenants who haven't paid
    // For this implementation, we broadcast to all tenants in the building
    await notificationService.createNotification({
      portalType: 'Tenant',
      moduleName: 'Payments',
      category: 'Reminder',
      title: 'Rent Due Reminder',
      message: `Your rent of ₹${amount || '5,000'} for ${month || 'this month'} is due on ${dueDate || 'the 5th'}. Please pay on time to avoid late fees.`,
      priority: 'High',
      type: 'warning',
      buildingId,
      target: 'All Tenants',
      actionLink: '/payments'
    });

    res.status(200).json({ message: 'Reminders sent to all tenants' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPayment, getAllPayments, getMyPayments, updatePaymentStatus, sendPaymentReminders };
