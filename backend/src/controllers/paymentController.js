const Payment = require('../models/Payment');
const Building = require('../models/Building');
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
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { buildingId } = req.query;

    // Get all buildings owned by this user
    const buildings = await Building.find({ owner: ownerId });
    const ownerBuildingIds = buildings.map(b => b._id.toString());

    let query = { buildingId: { $in: ownerBuildingIds } };

    if (buildingId) {
      if (!ownerBuildingIds.includes(buildingId)) {
        return res.status(403).json({ message: "Access denied to this building's data" });
      }
      query.buildingId = buildingId;
    }

    const payments = await Payment.find(query)
      .populate({
        path: 'tenantId',
        select: 'name room'
      })
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

module.exports = { createPayment, getAllPayments, getMyPayments };
