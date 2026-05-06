const RoomTransfer = require('../models/RoomTransfer');
const Tenant = require('../models/Tenant');

exports.createTransfer = async (req, res) => {
  try {
    const { newRoom, reason } = req.body;
    let tenant = await Tenant.findOne({ email: req.user.email });
    
    // Auto-create tenant profile if missing (same as complaints)
    if (!tenant) {
        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        tenant = await Tenant.create({
          name: user.name,
          email: user.email,
          phone: user.phone || 'N/A',
          emergencyContact: 'N/A',
          status: 'PENDING'
        });
    }

    // Ensure buildingId is set. If missing on tenant, try to find it.
    let buildingId = tenant.buildingId;
    if (!buildingId && tenant.room) {
      const Room = require('../models/Room');
      const Floor = require('../models/Floor');
      
      const roomObj = await Room.findOne({ 
        $or: [
          { _id: require('mongoose').Types.ObjectId.isValid(tenant.room) ? tenant.room : null },
          { roomNumber: tenant.room }
        ]
      }).populate('floor');
      
      if (roomObj && roomObj.floor) {
        buildingId = roomObj.floor.building;
      }
    }

    const transfer = await RoomTransfer.create({
      tenant: tenant._id,
      user: req.user.id,
      buildingId, // Inherit building
      oldRoom: tenant.room || 'N/A',
      newRoom,
      reason,
      status: 'PENDING'
    });

    res.status(201).json(transfer);
  } catch (err) {
    console.error('Error creating transfer:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getMyTransfers = async (req, res) => {
  try {
    const transfers = await RoomTransfer.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(transfers);
  } catch (err) {
    console.error('Error getting my transfers:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTransfers = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const query = {};
    if (buildingId) query.buildingId = buildingId;

    const transfers = await RoomTransfer.find(query)
      .populate('tenant', 'name room email')
      .sort({ createdAt: -1 });
    res.json(transfers);
  } catch (err) {
    console.error('Error getting all transfers:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateTransferStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const transfer = await RoomTransfer.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!transfer) return res.status(404).json({ message: 'Transfer request not found' });

    // If accepted, we could also update the Tenant profile room automatically
    if (status === 'ACCEPTED') {
        await Tenant.findByIdAndUpdate(transfer.tenant, { room: transfer.newRoom });
    }

    res.json(transfer);
  } catch (err) {
    console.error('Error updating transfer status:', err);
    res.status(500).json({ message: err.message });
  }
};
