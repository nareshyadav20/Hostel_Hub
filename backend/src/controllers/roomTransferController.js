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

    // Real-time sync: Notify owner portal of new transfer request
    const socketService = require('../utils/socketService');
    const notificationService = require('../utils/notificationService');
    
    await notificationService.createNotification({
      moduleName: 'Rooms',
      portalType: 'Owner',
      category: 'Room Transfer',
      title: 'New Transfer Request',
      message: `${tenant.name} requested transfer from ${tenant.room || 'N/A'} to ${newRoom}. Reason: ${reason}`,
      priority: 'Medium',
      type: 'info',
      buildingId,
      tenantId: tenant._id,
      actionLink: '/transfers'
    });

    socketService.emitToOwner('transferCreated', { transfer, tenantName: tenant.name });
    if (buildingId) socketService.emitUpdate(buildingId.toString(), 'transferCreated', { transfer, tenantName: tenant.name });

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
    // Owner filter — ensure only owner's buildings are visible
    const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id');
    const bIds = ownerBuildings.map(b => b._id);

    // Optional single-building filter from query param
    const { buildingId } = req.query;
    let query;
    if (buildingId) {
      const isOwned = bIds.some(id => id.toString() === buildingId);
      if (!isOwned) return res.status(403).json({ message: 'Access denied to this building.' });
      query = { buildingId };
    } else {
      // Include unassigned transfers so new tenant requests are visible to owner
      query = {
        $or: [
          { buildingId: { $in: bIds } },
          { buildingId: null },
          { buildingId: { $exists: false } }
        ]
      };
    }

    const transfers = await RoomTransfer.find(query)
      .populate('tenant', 'name room email phone')
      .sort({ createdAt: -1 });
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTransferStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const transfer = await RoomTransfer.findById(req.params.id).populate('tenant', 'name email');
    if (!transfer) return res.status(404).json({ message: 'Transfer request not found' });

    // Allow update if owner owns the building OR if no building is assigned yet
    if (transfer.buildingId) {
      const building = await Building.findOne({ _id: transfer.buildingId, owner: req.user.id });
      if (!building) return res.status(403).json({ message: 'Unauthorized to update this transfer' });
    }

    transfer.status = status;
    await transfer.save();
    
    if (status === 'ACCEPTED' || status === 'Approved') {
        await Tenant.findByIdAndUpdate(transfer.tenant._id, { room: transfer.newRoom });
    }

    // Real-time sync: Notify tenant portal of status update instantly
    const socketService = require('../utils/socketService');
    const notificationService = require('../utils/notificationService');
    const updatedTransfer = transfer.toObject();
    
    await notificationService.createNotification({
      moduleName: 'Rooms',
      portalType: 'Tenant',
      category: 'Room Transfer',
      title: 'Transfer Request Update',
      message: `Your room transfer request to ${transfer.newRoom} has been ${status}.`,
      type: status === 'ACCEPTED' || status === 'Approved' ? 'success' : 'error',
      buildingId: transfer.buildingId,
      tenantId: transfer.tenant._id,
      createdBy: req.user.id
    });

    if (transfer.buildingId) socketService.emitUpdate(transfer.buildingId.toString(), 'transferStatusChanged', updatedTransfer);
    // Global emit so tenant catches status change regardless of which room they joined
    socketService.emitToOwner('transferStatusChanged', updatedTransfer);

    res.json(transfer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
