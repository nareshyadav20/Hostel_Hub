const Transfer = require('../models/tenant/Transfer');
const { getOrCreateTenant } = require('../utils/tenantHelper');

exports.createTransfer = async (req, res) => {
  try {
    const { name, oldRoom, newRoom, reason } = req.body;
    const tenant = await getOrCreateTenant(req.user);
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    console.log('🔄 Creating Transfer Request for:', tenant.email);
    const transfer = await Transfer.create({
      name,
      oldRoom,
      newRoom,
      reason,
      tenant: tenant._id,
      user: req.user.id
    });
    console.log('✅ Transfer Saved:', transfer._id);
    res.status(201).json(transfer);
  } catch (error) {
    console.error('❌ Transfer Error:', error);
    res.status(500).json({ message: 'Failed to create transfer request', error: error.message });
  }
};

exports.getMyTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(transfers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transfer requests', error: error.message });
  }
};

exports.getAllTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find().populate('tenant').sort({ createdAt: -1 });
    res.status(200).json(transfers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all transfer requests', error: error.message });
  }
};

exports.updateTransferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const transfer = await Transfer.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json(transfer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update transfer status', error: error.message });
  }
};
