const RoomTransfer = require('../models/RoomTransfer');
const Tenant = require('../models/Tenant');
const Building = require('../models/Building');

exports.createTransfer = async (req, res) => {
  try {
    const { newRoom, reason } = req.body;
    let tenant = await Tenant.findOne({ email: req.user.email });
    
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
      buildingId,
      oldRoom: tenant.room || 'N/A',
      newRoom,
      reason,
      status: 'PENDING'
    });

    res.status(201).json(transfer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyTransfers = async (req, res) => {
  try {
    const transfers = await RoomTransfer.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTransfers = async (req, res) => {
  try {
    // Owner filter
    const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id');
    const bIds = ownerBuildings.map(b => b._id);

    const transfers = await RoomTransfer.find({ buildingId: { $in: bIds } })
      .populate('tenant', 'name room email')
      .sort({ createdAt: -1 });
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTransferStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Check ownership before update
    const transfer = await RoomTransfer.findById(req.params.id);
    if (!transfer) return res.status(404).json({ message: 'Transfer request not found' });

    const building = await Building.findOne({ _id: transfer.buildingId, owner: req.user.id });
    if (!building) return res.status(403).json({ message: 'Unauthorized to update this transfer' });

    transfer.status = status;
    await transfer.save();
    
    if (status === 'ACCEPTED') {
        await Tenant.findByIdAndUpdate(transfer.tenant, { room: transfer.newRoom });
    }

    res.json(transfer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
