const Hostel = require('../models/Hostel');
const Building = require('../models/Building');
const Floor = require('../models/Floor');
const Room = require('../models/Room');
const Bed = require('../models/Bed');
const socketService = require('../utils/socketService');

exports.createHostel = async (req, res) => {
  try {
    const hostel = await Hostel.create({ ...req.body, owner: req.user.id });
    res.status(201).json(hostel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ owner: req.user.id });
    res.status(200).json(hostels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Real-time synchronization
    // Emit to all buildings associated with this hostel
    if (hostel.buildings && hostel.buildings.length > 0) {
      hostel.buildings.forEach(buildingId => {
        socketService.emitUpdate(buildingId, 'hostelUpdated', hostel);
      });
    } else {
      socketService.emitUpdate(null, 'hostelUpdated', hostel);
    }

    res.status(200).json(hostel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHostel = async (req, res) => {
  try {
    await Hostel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Hostel deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /hostels/bed-stats?buildingId=xxx
exports.getBedStats = async (req, res) => {
  try {
    const { buildingId } = req.query;

    // Find hostel by owner (reliable — Building model has no hostel ref)
    const hostel = await Hostel.findOne({ owner: req.user.id });

    // Walk hierarchy: owner's buildings → floors → rooms → beds
    // If buildingId is provided, scope to that building only
    const buildingQuery = buildingId
      ? { _id: buildingId, owner: req.user.id }
      : { owner: req.user.id };
    const ownerBuildings = await Building.find(buildingQuery).select('_id totalBeds totalRooms');
    const bIds = ownerBuildings.map(b => b._id);
    const configuredTotal = ownerBuildings.reduce((sum, b) => sum + (b.totalBeds || 0), 0);
    const configuredRooms = ownerBuildings.reduce((sum, b) => sum + (b.totalRooms || 0), 0);

    const floors = await Floor.find({ building: { $in: bIds } }).select('_id');
    const fIds = floors.map(f => f._id);

    const rooms = await Room.find({ floor: { $in: fIds } }).select('_id');
    const rIds = rooms.map(r => r._id);

    // Live counts — always accurate regardless of hostel.filledBeds
    const liveTotal   = await Bed.countDocuments({ room: { $in: rIds } });
    const liveFilledPhysical = await Bed.countDocuments({ room: { $in: rIds }, status: 'OCCUPIED' });
    
    // Also check BedFilling documents (virtual beds created during booking)
    const BedFilling = require('../models/BedFilling');
    const liveFilledVirtual = await BedFilling.countDocuments({ buildingId: { $in: bIds }, status: 'Occupied' });
    
    const liveFilled = Math.max(liveFilledPhysical, liveFilledVirtual);

    // Use liveTotal if it is greater than 0, otherwise fall back to configuredTotal / hostel.totalBeds
    let totalBeds = liveTotal;
    if (liveTotal === 0) {
      if (hostel && hostel.totalBeds > 0) {
        totalBeds = hostel.totalBeds;
      } else if (configuredTotal > 0) {
        totalBeds = configuredTotal;
      }
    }

    // Determine total rooms
    const totalRoomsCount = rIds.length > 0 ? rIds.length : (configuredRooms > 0 ? configuredRooms : 0);

    const filledBeds   = Math.min(liveFilled, totalBeds);
    const availableBeds = Math.max(0, totalBeds - filledBeds);
    const occupancyPct  = totalBeds > 0 ? Math.round((filledBeds / totalBeds) * 100) : 0;

    // Keep hostel.filledBeds in sync quietly (fire-and-forget)
    if (hostel && hostel.filledBeds !== filledBeds) {
      hostel.filledBeds = filledBeds;
      hostel.save().catch(() => {});
    }

    res.status(200).json({
      hostelId: hostel?._id || null,
      totalRooms: totalRoomsCount,
      totalBeds,
      filledBeds,
      availableBeds,
      occupancyPct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /hostels/:id/sync-beds  — recalculate filledBeds from live bed data
exports.syncFilledBeds = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ _id: req.params.id, owner: req.user.id });
    if (!hostel) return res.status(404).json({ error: 'Hostel not found or unauthorized' });

    // Use owner's buildings (reliable, not hostel.buildings which may be empty)
    const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id totalBeds');
    const bIds = ownerBuildings.map(b => b._id);
    const configuredTotal = ownerBuildings.reduce((sum, b) => sum + (b.totalBeds || 0), 0);
    
    const floors = await Floor.find({ building: { $in: bIds } }).select('_id');
    const fIds = floors.map(f => f._id);
    const rooms = await Room.find({ floor: { $in: fIds } }).select('_id');
    const rIds = rooms.map(r => r._id);

    const liveTotal  = await Bed.countDocuments({ room: { $in: rIds } });
    const liveFilledPhysical = await Bed.countDocuments({ room: { $in: rIds }, status: 'OCCUPIED' });
    
    const BedFilling = require('../models/BedFilling');
    const liveFilledVirtual = await BedFilling.countDocuments({ buildingId: { $in: bIds }, status: 'Occupied' });
    
    const liveFilled = Math.max(liveFilledPhysical, liveFilledVirtual);

    let totalBeds = liveTotal;
    if (liveTotal === 0) {
      if (hostel.totalBeds > 0) {
        totalBeds = hostel.totalBeds;
      } else if (configuredTotal > 0) {
        totalBeds = configuredTotal;
      }
    }
    
    // Validate: filledBeds cannot exceed totalBeds
    const safeFilledBeds = Math.min(liveFilled, totalBeds);

    hostel.filledBeds = safeFilledBeds;
    await hostel.save();

    const availableBeds = Math.max(0, totalBeds - safeFilledBeds);
    const occupancyPct  = totalBeds > 0 ? Math.round((safeFilledBeds / totalBeds) * 100) : 0;

    res.status(200).json({
      hostelId: hostel._id,
      totalBeds,
      filledBeds: safeFilledBeds,
      availableBeds,
      occupancyPct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
