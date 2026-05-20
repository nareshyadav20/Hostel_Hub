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
    let buildingId = bodyBuildingId || (tenant.buildingId?._id || tenant.buildingId);
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

    // Find Hostel for this building
    if (buildingId) {
      const hostel = await Hostel.findOne({ buildings: buildingId });
      if (hostel) hostelId = hostel._id;
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || 'Medium',
      tenant: tenant._id,
      user: req.user.id,
      hostelId,
      buildingId,
      roomId,
      bedId
    });

    // Real-time synchronization for Owner
    if (buildingId) {
      socketService.emitUpdate(buildingId.toString(), 'complaintCreated', {
        complaint,
        tenantName: tenant.name
      });
      
      // Create Persistent Notification for Owner
      await notificationService.createNotification({
        moduleName: 'Complaints',
        portalType: 'Owner',
        category: category || 'Maintenance',
        title: 'New Complaint Raised',
        message: `${tenant.name} from Room ${tenant.room || 'N/A'} raised: ${title}`,
        priority: priority || 'Medium',
        type: 'warning',
        buildingId,
        tenantId: tenant._id,
        roomId: roomId ? roomId.toString() : null,
        actionLink: `/complaints`
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

    // Populate raw complaints programmatically
    const Building = require('../models/Building');
    for (let c of rawComplaints) {
      c.id = c._id.toString();
      if (c.tenant && mongoose.Types.ObjectId.isValid(c.tenant)) {
        c.tenant = await Tenant.findById(c.tenant, 'name room email').lean();
      }
      if (c.buildingId && mongoose.Types.ObjectId.isValid(c.buildingId)) {
        c.buildingId = await Building.findById(c.buildingId, 'name').lean();
      }
      if (c.roomId && mongoose.Types.ObjectId.isValid(c.roomId)) {
        c.roomId = await Room.findById(c.roomId, 'roomNumber').lean();
      }
    }

    const merged = [...ownerComplaints, ...rawComplaints].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    
    // Deduplicate to avoid React duplicate key warnings
    const seenIds = new Set();
    const uniqueComplaints = [];
    for (const c of merged) {
      const idStr = c._id.toString();
      if (!seenIds.has(idStr)) {
        seenIds.add(idStr);
        uniqueComplaints.push(c);
      }
    }

    res.status(200).json(uniqueComplaints);
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

    // Real-time synchronization for Tenant — emit globally since tenant may not have buildingId
    const buildingIdStr = complaint.buildingId ? complaint.buildingId.toString() : null;
    if (buildingIdStr) socketService.emitUpdate(buildingIdStr, 'complaintStatusChanged', complaint);
    // Also emit globally so all tenants receive their own update
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
      tenantId: complaint.tenant._id,
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

    // Populate raw complaints programmatically
    const Building = require('../models/Building');
    for (let c of rawComplaints) {
      c.id = c._id.toString();
      if (c.tenant && mongoose.Types.ObjectId.isValid(c.tenant)) {
        c.tenant = await Tenant.findById(c.tenant, 'name room email').lean();
      }
      if (c.buildingId && mongoose.Types.ObjectId.isValid(c.buildingId)) {
        c.buildingId = await Building.findById(c.buildingId, 'name').lean();
      }
      if (c.roomId && mongoose.Types.ObjectId.isValid(c.roomId)) {
        c.roomId = await Room.findById(c.roomId, 'roomNumber').lean();
      }
    }

    const merged = [...ownerComplaints, ...rawComplaints].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    
    // Deduplicate to avoid React duplicate key warnings
    const seenIds = new Set();
    const uniqueComplaints = [];
    for (const c of merged) {
      const idStr = c._id.toString();
      if (!seenIds.has(idStr)) {
        seenIds.add(idStr);
        uniqueComplaints.push(c);
      }
    }

    res.status(200).json(uniqueComplaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all complaints', error: error.message });
  }
};
