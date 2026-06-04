const Hostel = require('../models/Hostel');
const Building = require('../models/Building');
const Floor = require('../models/Floor');
const Room = require('../models/Room');
const Bed = require('../models/Bed');
const socketService = require('../utils/socketService');

// ─── Owner-facing routes (require auth) ──────────────────────────────────────

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

    const hostel = await Hostel.findOne({ owner: req.user.id });

    let buildingQuery;
    if (buildingId) {
      const subBuildings = await Building.find({ propertyId: buildingId }).select('_id');
      const bIds = [buildingId, ...subBuildings.map(sb => sb._id)];
      buildingQuery = { _id: { $in: bIds }, owner: req.user.id };
    } else {
      buildingQuery = { owner: req.user.id };
    }
    const ownerBuildings = await Building.find(buildingQuery).select('_id totalBeds totalRooms');
    const bIds = ownerBuildings.map(b => b._id);
    const configuredTotal = ownerBuildings.reduce((sum, b) => sum + (b.totalBeds || 0), 0);
    const configuredRooms = ownerBuildings.reduce((sum, b) => sum + (b.totalRooms || 0), 0);

    const floors = await Floor.find({ building: { $in: bIds } }).select('_id');
    const fIds = floors.map(f => f._id);

    const rooms = await Room.find({ floor: { $in: fIds } }).select('_id');
    const rIds = rooms.map(r => r._id);

    const liveTotal   = await Bed.countDocuments({ room: { $in: rIds } });
    const liveFilledPhysical = await Bed.countDocuments({ room: { $in: rIds }, status: 'OCCUPIED' });

    const BedFilling = require('../models/BedFilling');
    const liveFilledVirtual = await BedFilling.countDocuments({ buildingId: { $in: bIds }, status: 'Occupied' });

    const liveFilled = Math.max(liveFilledPhysical, liveFilledVirtual);

    let totalBeds = liveTotal;
    if (liveTotal === 0) {
      if (hostel && hostel.totalBeds > 0) {
        totalBeds = hostel.totalBeds;
      } else if (configuredTotal > 0) {
        totalBeds = configuredTotal;
      }
    }

    const totalRoomsCount = rIds.length > 0 ? rIds.length : (configuredRooms > 0 ? configuredRooms : 0);

    const filledBeds   = Math.min(liveFilled, totalBeds);
    const availableBeds = Math.max(0, totalBeds - filledBeds);
    const occupancyPct  = totalBeds > 0 ? Math.round((filledBeds / totalBeds) * 100) : 0;

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

// PATCH /hostels/:id/sync-beds
exports.syncFilledBeds = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ _id: req.params.id, owner: req.user.id });
    if (!hostel) return res.status(404).json({ error: 'Hostel not found or unauthorized' });

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

// ─── Flutter / Public APIs ────────────────────────────────────────────────────

/**
 * GET /api/hostels/list?page=1&limit=20
 * Paginated hostel listing for Flutter's Explore page / infinite scroll.
 * No auth required — public read.
 */
exports.getHostelsPaginated = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip  = (page - 1) * limit;

    const totalRecords = await Hostel.countDocuments({});
    const totalPages   = Math.ceil(totalRecords / limit) || 1;

    const hostels = await Hostel.find({})
      .skip(skip)
      .limit(limit)
      .select('name address location totalBeds filledBeds description images hasMess hasGym hasLaundry createdAt')
      .lean();

    // Shape each hostel for Flutter
    const data = hostels.map(h => ({
      hostelId:      h._id,
      name:          h.name,
      location:      h.location || h.address || '',
      rent:          0,          // Rent is per-room; placeholder for mobile card
      rating:        h.rating || 0,
      availableBeds: Math.max(0, (h.totalBeds || 0) - (h.filledBeds || 0)),
      totalBeds:     h.totalBeds || 0,
      images:        h.images || [],
      amenities: {
        mess:        h.hasMess,
        gym:         h.hasGym,
        laundry:     h.hasLaundry,
      }
    }));

    return res.status(200).json({
      success:      true,
      page,
      limit,
      totalRecords,
      totalPages,
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/hostels/search
 *   ?location=Hyderabad
 *   &page=1&limit=20
 *   &sortBy=rating|rent|createdAt
 *   &sortOrder=asc|desc
 *
 * Combines location filter + pagination + sorting.
 * No auth required — public read.
 */
exports.searchHostels = async (req, res) => {
  try {
    const { location, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip  = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (location && location.trim()) {
      const rx = new RegExp(location.trim(), 'i');
      filter.$or = [{ location: rx }, { address: rx }];
    }

    // Validate sort fields to prevent injection
    const allowedSortFields = ['rent', 'rating', 'createdAt'];
    const safeSortBy    = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const safeSortOrder = sortOrder === 'asc' ? 1 : -1;

    const totalRecords = await Hostel.countDocuments(filter);
    const totalPages   = Math.ceil(totalRecords / limit) || 1;

    const hostels = await Hostel.find(filter)
      .sort({ [safeSortBy]: safeSortOrder })
      .skip(skip)
      .limit(limit)
      .select('name address location totalBeds filledBeds description images hasMess hasGym hasLaundry rating createdAt')
      .lean();

    const data = hostels.map(h => ({
      hostelId:      h._id,
      name:          h.name,
      location:      h.location || h.address || '',
      rent:          0,
      rating:        h.rating || 0,
      availableBeds: Math.max(0, (h.totalBeds || 0) - (h.filledBeds || 0)),
      totalBeds:     h.totalBeds || 0,
      images:        h.images || [],
    }));

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalRecords,
      totalPages,
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/hostels/:hostelId/detail
 * Full hostel detail for the hostel detail page in Flutter.
 * No auth required — public read.
 */
exports.getHostelDetail = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.hostelId).lean();
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        hostelId:      hostel._id,
        name:          hostel.name,
        address:       hostel.address,
        location:      hostel.location || hostel.address || '',
        description:   hostel.description || '',
        totalBeds:     hostel.totalBeds || 0,
        availableBeds: Math.max(0, (hostel.totalBeds || 0) - (hostel.filledBeds || 0)),
        rating:        hostel.rating || 0,
        images:        hostel.images || [],
        ownerDetails:  hostel.ownerDetails || {},
        amenities: {
          security:      hostel.hasSecurity,
          cctv:          hostel.hasCCTV,
          parking:       hostel.hasParking,
          powerBackup:   hostel.hasPowerBackup,
          mess:          hostel.hasMess,
          gym:           hostel.hasGym,
          library:       hostel.hasLibrary,
          laundry:       hostel.hasLaundry,
          housekeeping:  hostel.hasHousekeeping,
          medicalSupport:hostel.hasMedicalSupport,
        },
        createdAt: hostel.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
