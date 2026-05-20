const Complaint = require('../models/Complaint');
const Tenant = require('../models/Tenant');
const Hostel = require('../models/Hostel');
const Bed = require('../models/Bed');
const Room = require('../models/Room');
const mongoose = require('mongoose');
const socketService = require('../utils/socketService');
const notificationService = require('../utils/notificationService');

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, tenantId, buildingId: bodyBuildingId } = req.body;
    let tenant;
    
    if (tenantId) {
      tenant = await Tenant.findById(tenantId);
    } else {
      tenant = await Tenant.findOne({ email: req.user.email });
    }
    
    // If tenant profile is missing, create it
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

    // Robust hierarchy mapping
    let buildingId = bodyBuildingId;
    if (buildingId === 'undefined' || buildingId === 'null') {
      buildingId = null;
    }
    buildingId = buildingId || (tenant.buildingId?._id || tenant.buildingId);
    let roomId = tenant.roomId?._id || tenant.roomId || null;
    let bedId = tenant.bedId?._id || tenant.bedId || null;
    let hostelId = null;

    // Try to find bed assignment first
    const bed = await Bed.findOne({ tenant: tenant._id }).populate({
      path: 'room',
      populate: { path: 'floor' }
    });

    if (bed) {
      bedId = bed._id;
      if (bed.room) {
        roomId = bed.room._id;
        if (bed.room.floor) {
          buildingId = bed.room.floor.building;
        }
      }
    }

    // If still no buildingId, check legacy fields or pre-assigned
    if (!buildingId && tenant.room) {
      const roomObj = await Room.findOne({ 
        $or: [
          { _id: mongoose.Types.ObjectId.isValid(tenant.room) ? tenant.room : null },
          { roomNumber: tenant.room }
        ]
      }).populate({ path: 'floor' });
      
      if (roomObj) {
        roomId = roomObj._id;
        if (roomObj.floor) buildingId = roomObj.floor.building;
      }
    }

    // Find Hostel for this building and Owner
    let ownerId = null;
    if (buildingId) {
      const hostel = await Hostel.findOne({ buildings: buildingId });
      if (hostel) hostelId = hostel._id;
      
      const Building = require('../models/Building');
      const buildingDoc = await Building.findById(buildingId);
      if (buildingDoc) ownerId = buildingDoc.owner;
    }

    let { asset, subIssue, customIssue } = req.body;
    if (!asset || asset === 'undefined' || asset === 'null' || asset === '') {
      asset = null;
    }
    if (!subIssue || subIssue === 'undefined' || subIssue === 'null' || subIssue === '') {
      subIssue = null;
    }
    if (!customIssue || customIssue === 'undefined' || customIssue === 'null' || customIssue === '') {
      customIssue = null;
    }

    let finalCategory = category;
    if (asset) {
      finalCategory = subIssue || customIssue || asset;
    }

    const complaint = await Complaint.create({
      title,
      description,
      category: finalCategory,
      priority: priority || 'Medium',
      tenant: tenant._id,
      user: req.user.id,
      hostelId,
      buildingId,
      roomId,
      bedId,
      ownerId,
      asset,
      subIssue,
      customIssue
    });

    // Real-time synchronization for Owner
    if (buildingId) {
      socketService.emitUpdate(buildingId.toString(), 'complaintCreated', {
        complaint,
        tenantName: tenant.name
      });
      
      // Create Persistent Notification for Owner
      const isAssetComplaint = !!asset;
      await notificationService.createNotification({
        moduleName: isAssetComplaint ? 'Assets' : 'Complaints',
        portalType: 'Owner',
        category: isAssetComplaint ? 'Assets' : (category || 'Maintenance'),
        title: isAssetComplaint ? `New Asset Issue: ${asset}` : 'New Complaint Raised',
        message: isAssetComplaint 
          ? `${tenant.name} reported a problem with ${asset} (${subIssue || customIssue || 'General Issue'}): ${title}` 
          : `${tenant.name} from Room ${tenant.room || 'N/A'} raised: ${title}`,
        priority: priority || 'Medium',
        type: 'warning',
        buildingId,
        tenantId: tenant._id,
        roomId: roomId ? roomId.toString() : null,
        actionLink: isAssetComplaint ? `/assets` : `/complaints`
      });
    }
    socketService.emitToOwner('complaintCreated', {
      complaint,
      tenantName: tenant.name
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create complaint', error: error.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    // 1. Fetch from owner_complaints
    const ownerComplaints = await Complaint.find({ user: req.user.id })
      .populate('tenant', 'name room email')
      .populate('buildingId', 'name')
      .populate('roomId', 'roomNumber')
      .lean();

    // 2. Fetch from complaints
    const db = mongoose.connection.db;
    const rawComplaints = await db.collection('complaints').find({ 
      user: mongoose.Types.ObjectId.isValid(req.user.id) ? new mongoose.Types.ObjectId(req.user.id) : req.user.id 
    }).toArray();

    // Populate raw complaints programmatically using concurrent bulk queries (solving N+1 problem)
    await populateRawComplaints(rawComplaints);

    const merged = [...ownerComplaints, ...rawComplaints].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    res.status(200).json(merged);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;
    const update = { status };
    if (assignedTo) update.assignedTo = assignedTo;
    
    const complaint = await Complaint.findByIdAndUpdate(id, update, { new: true })
      .populate('user', 'name email')
      .populate('tenant', 'name email');

    // Real-time synchronization for Tenant & Owner
    const buildingIdStr = complaint.buildingId ? complaint.buildingId.toString() : null;
    const tenantIdStr = (complaint.tenant?._id || complaint.tenant || complaint.user)?.toString();
    
    if (buildingIdStr) {
      socketService.emitUpdate(buildingIdStr, 'complaintStatusChanged', complaint);
    }
    if (tenantIdStr) {
      socketService.emitToUser(tenantIdStr, 'Tenant', 'complaintStatusChanged', complaint);
    }
    // Emit to owner dashboard
    socketService.emitToOwner('complaintStatusChanged', complaint);

    // Create notification for tenant
    await notificationService.createNotification({
      title: 'Complaint Status Updated',
      message: `Your complaint "${complaint.title}" is now ${status}.`,
      moduleName: 'Complaints',
      portalType: 'Tenant',
      category: 'Maintenance',
      type: 'info',
      buildingId: complaint.buildingId,
      tenantId: tenantIdStr,
      receiverId: tenantIdStr,
      receiverRole: 'Tenant',
      createdBy: req.user.id
    });

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update complaint', error: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const { buildingId, hostelId, status } = req.query;
    let query = {};

    if (buildingId) query.buildingId = buildingId;
    if (hostelId) query.hostelId = hostelId;
    if (status) query.status = status;

    // Scoping check: DO NOT restrict if user is SUPER_ADMIN or ADMIN
    if (!buildingId && !hostelId && req.user && req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN') {
      try {
        const Building = require('../models/Building');
        const ownerBuildings = await Building.find({ owner: req.user.id }, '_id').lean();
        const buildingIds = ownerBuildings.map(b => b._id);
        if (buildingIds.length > 0) {
          query.$or = [
            { buildingId: { $in: buildingIds } },
            { buildingId: null },
            { buildingId: { $exists: false } }
          ];
        }
        // If no buildings found, query is empty — returns all complaints
      } catch (_e) {
        // Fallback
      }
    }

    // 1. Fetch from owner_complaints (via Complaint model)
    const ownerComplaints = await Complaint.find(query)
      .populate('tenant', 'name room email')
      .populate('buildingId', 'name')
      .populate('roomId', 'roomNumber')
      .sort({ createdAt: -1 })
      .lean();

    // 2. Fetch from complaints collection directly
    const db = mongoose.connection.db;
    const rawQuery = {};
    
    if (query.buildingId) {
      if (query.buildingId.$in) {
        const ids = query.buildingId.$in;
        rawQuery.$or = [
          { buildingId: { $in: ids.map(id => id.toString()) } },
          { buildingId: { $in: ids.map(id => new mongoose.Types.ObjectId(id)) } }
        ];
      } else {
        const idStr = query.buildingId.toString();
        rawQuery.$or = [
          { buildingId: idStr },
          { buildingId: new mongoose.Types.ObjectId(idStr) }
        ];
      }
    }
    if (query.status) {
      rawQuery.status = query.status;
    }

    const rawComplaints = await db.collection('complaints').find(rawQuery).toArray();

    // Populate raw complaints programmatically using concurrent bulk queries (solving N+1 problem)
    await populateRawComplaints(rawComplaints);

    const merged = [...ownerComplaints, ...rawComplaints].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    res.status(200).json(merged);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all complaints', error: error.message });
  }
};

// High-performance helper to populate raw complaints in bulk, avoiding N+1 database queries
const populateRawComplaints = async (rawComplaints) => {
  if (!rawComplaints || rawComplaints.length === 0) return rawComplaints;

  const Building = require('../models/Building');

  const tenantIds = new Set();
  const buildingIds = new Set();
  const roomIds = new Set();

  for (const c of rawComplaints) {
    if (c.tenant && mongoose.Types.ObjectId.isValid(c.tenant)) {
      tenantIds.add(c.tenant.toString());
    }
    if (c.buildingId && mongoose.Types.ObjectId.isValid(c.buildingId)) {
      buildingIds.add(c.buildingId.toString());
    }
    if (c.roomId && mongoose.Types.ObjectId.isValid(c.roomId)) {
      roomIds.add(c.roomId.toString());
    }
  }

  const [tenants, buildings, rooms] = await Promise.all([
    Tenant.find({ _id: { $in: Array.from(tenantIds) } }, 'name room email').lean(),
    Building.find({ _id: { $in: Array.from(buildingIds) } }, 'name').lean(),
    Room.find({ _id: { $in: Array.from(roomIds) } }, 'roomNumber').lean()
  ]);

  const tenantMap = new Map(tenants.map(t => [t._id.toString(), t]));
  const buildingMap = new Map(buildings.map(b => [b._id.toString(), b]));
  const roomMap = new Map(rooms.map(r => [r._id.toString(), r]));

  for (const c of rawComplaints) {
    c.id = c._id.toString();
    if (c.tenant) {
      c.tenant = tenantMap.get(c.tenant.toString()) || null;
    }
    if (c.buildingId) {
      c.buildingId = buildingMap.get(c.buildingId.toString()) || null;
    }
    if (c.roomId) {
      c.roomId = roomMap.get(c.roomId.toString()) || null;
    }
  }

  return rawComplaints;
};
