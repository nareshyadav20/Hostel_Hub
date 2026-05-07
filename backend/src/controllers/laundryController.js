const Laundry = require('../models/tenant/Laundry');
const Tenant = require('../models/tenant/Tenant');

exports.createLaundryOrder = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ email: req.user.email });
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    const orderNumber = 'L-' + Math.floor(1000 + Math.random() * 9000);
    const laundry = await Laundry.create({
      orderNumber,
      tenant: tenant._id,
      user: req.user.id
    });

    res.status(201).json(laundry);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create laundry order', error: error.message });
  }
};

exports.getMyLaundryOrders = async (req, res) => {
  try {
    const orders = await Laundry.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch laundry orders', error: error.message });
  }
};
