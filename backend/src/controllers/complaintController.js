const Complaint = require('../models/Complaint');
const Tenant = require('../models/Tenant');
const Hostel = require('../models/Hostel');
const Bed = require('../models/Bed');
const Room = require('../models/Room');
const mongoose = require('mongoose');

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
    let buildingId = bodyBuildingId || tenant.buildingId;
    let roomId = null;
    let bedId = null;
    let hostelId = null;

    // Try to find bed assignment first
    const bed = await Bed.findOne({ tenant: tenant._id }).populate({
      path: 'roomId',
      populate: { path: 'floor' }
    });

    if (bed) {
      bedId = bed._id;
      if (bed.roomId) {
        roomId = bed.roomId._id;
        if (bed.roomId.floor) {
          buildingId = bed.roomId.floor.buildingId;
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
        if (roomObj.floor) buildingId = roomObj.floor.buildingId;
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

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create complaint', error: error.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;
    
    const existingComplaint = await Complaint.findById(id);
    if (!existingComplaint) return res.status(404).json({ message: 'Complaint not found' });
    
    if (existingComplaint.buildingId) {
       const Building = require('../models/Building');
       const building = await Building.findOne({ _id: existingComplaint.buildingId, owner: req.user.id });
       if (!building) return res.status(403).json({ message: 'Access denied' });
    }
    
    const update = { status };
    if (assignedTo) update.assignedTo = assignedTo;
    
    const complaint = await Complaint.findByIdAndUpdate(id, update, { new: true });
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update complaint', error: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const { buildingId, hostelId, status } = req.query;
    let query = {};
    
    const Building = require('../models/Building');
    const ownerBuildings = await Building.find({ owner: req.user.id }, '_id').lean();
    const buildingIds = ownerBuildings.map(b => b._id.toString());
    
    if (buildingId) {
      if (!buildingIds.includes(buildingId)) {
        return res.status(403).json({ message: 'Access denied to this building' });
      }
      query.buildingId = buildingId;
    } else {
      if (ownerBuildings.length > 0) {
        query.buildingId = { $in: ownerBuildings.map(b => b._id) };
      } else {
        // Force empty array if no buildings owned, to prevent leaking all complaints
        query.buildingId = { $in: [] };
      }
    }

    if (hostelId) query.hostelId = hostelId;
    if (status) query.status = status;

    const complaints = await Complaint.find(query)
      .populate('tenant', 'name room email')
      .populate('buildingId', 'name')
      .populate('roomId', 'roomNumber')
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all complaints', error: error.message });
  }
};
