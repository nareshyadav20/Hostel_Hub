const Payment = require('../models/Payment');
const Tenant = require('../models/Tenant');

const createPayment = async (req, res) => {
  try {
    const { tenantId, amount, type, method, buildingId, category, status } = req.body;
    
    // Generate simple invoice ID
    const invoice = `${type.toUpperCase().substring(0,3)}-${Date.now().toString().slice(-6)}`;
    
    const payment = new Payment({
      tenantId,
      amount,
      type,
      method: method || 'UPI',
      buildingId,
      category: category || 'Standard',
      status: status || 'Paid',
      invoice,
      month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyPayments = async (req, res) => {
  try {
    // In a real app, we'd use req.user.id
    // For now, we'll allow passing tenantId or use a dummy for demo if needed
    const { tenantId } = req.query;
    const payments = await Payment.find({ tenantId }).sort({ date: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPayment, getAllPayments, getMyPayments };
