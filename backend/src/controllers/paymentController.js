const Payment = require('../models/Payment');
const Tenant = require('../models/Tenant');
const Building = require('../models/Building');
const socketService = require('../utils/socketService');

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
    const notificationService = require('../utils/notificationService');
    socketService.emitUpdate(buildingId, 'paymentAdded', populated);
    socketService.emitUpdate(buildingId, 'dashboardStatsUpdated', {});

    await notificationService.createNotification({
      moduleName: 'Payments',
      portalType: 'Owner',
      category: 'Rent Payment',
      title: 'Payment Received',
      message: `${populated.tenantId?.name || 'Tenant'} paid ₹${amount} for ${month}`,
      priority: 'Medium',
      type: 'success',
      buildingId,
      tenantId: populated.tenantId?._id,
      actionLink: '/payments'
    });
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

    const isValidBuildingId = buildingId && 
                             buildingId !== 'undefined' && 
                             buildingId !== 'null' && 
                             require('mongoose').Types.ObjectId.isValid(buildingId);

    if (isValidBuildingId) {
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

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPayment, getAllPayments, getMyPayments, updatePaymentStatus };
