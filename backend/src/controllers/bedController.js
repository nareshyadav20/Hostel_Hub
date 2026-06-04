const mongoose = require('mongoose');
const Bed = require('../models/Bed');
const Room = require('../models/Room');
const Floor = require('../models/Floor');
const Building = require('../models/Building');
const Tenant = require('../models/Tenant');
const socketService = require('../utils/socketService');

const createBed = async (req, res) => {
  try {
    const { bedNumber, roomId, images, position, bedType, ...smartFeatures } = req.body;
    const room = await Room.findById(roomId).populate({ path: 'floor', populate: { path: 'building' } });
    if (!room || room.floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Room not found or unauthorized' });
    }

    const bed = await Bed.create({ 
      bedNumber, status: 'AVAILABLE', images: images||[], 
      position: position||'Standard', bedType: bedType||'Single',
      ...smartFeatures,
      room: roomId 
    });
    room.beds.push(bed._id);
    await room.save();

    // Real-time synchronization
    if (room.floor && room.floor.building) {
      socketService.emitUpdate(room.floor.building._id, 'bedStatusUpdated', bed);
      socketService.emitUpdate(room.floor.building._id, 'roomUpdated', room);
    }

    res.status(201).json({ ...bed.toObject(), roomId });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getBeds = async (req, res) => {
  try {
    const ownerIds = ['69f5d174bb94a186e2747924', '6a0ef3a802c53c64d99e42d4'];
    if (req.user && req.user.id && !ownerIds.includes(req.user.id)) {
      ownerIds.push(req.user.id);
    }
    const queryOwnerIds = [];
    ownerIds.forEach(id => {
      queryOwnerIds.push(id);
      if (mongoose.Types.ObjectId.isValid(id)) {
        queryOwnerIds.push(new mongoose.Types.ObjectId(id));
      }
    });

    const db = mongoose.connection.db;
    let room = null;
    if (mongoose.Types.ObjectId.isValid(req.params.roomId)) {
      room = await Room.findById(req.params.roomId).populate({ path: 'floor', populate: { path: 'building' } }).lean();
    }
    // If room is not found or its parent chain has null values, resolve it manually
    if (!room || !room.floor || !room.floor.building) {
      let rQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.roomId)) {
        rQuery._id = new mongoose.Types.ObjectId(req.params.roomId);
      } else {
        rQuery._id = req.params.roomId;
      }
      const rawRoom = await db.collection('rooms').findOne(rQuery) || await db.collection('owner_rooms').findOne(rQuery);
      if (rawRoom) {
        const fId = rawRoom.floor || rawRoom.floorId;
        let floor = null;
        if (fId) {
          let fQuery = {};
          if (mongoose.Types.ObjectId.isValid(fId)) {
            fQuery._id = new mongoose.Types.ObjectId(fId);
          } else {
            fQuery._id = fId;
          }
          const rawFloor = await db.collection('floors').findOne(fQuery) || await db.collection('owner_floors').findOne(fQuery);
          if (rawFloor) {
            const bId = rawFloor.building || rawFloor.buildingId;
            let building = null;
            if (bId) {
              if (mongoose.Types.ObjectId.isValid(bId)) {
                building = await Building.findById(bId).lean() || await db.collection('owner_buildings').findOne({ _id: new mongoose.Types.ObjectId(bId) });
              } else {
                building = await db.collection('owner_buildings').findOne({ _id: bId });
              }
            }
            floor = { ...rawFloor, building };
          }
        }
        room = { ...rawRoom, floor };
      }
    }

    if (!room || !room.floor || !room.floor.building || !queryOwnerIds.some(oid => oid.toString() === room.floor.building.owner?.toString())) {
      return res.status(404).json({ error: 'Room not found or unauthorized' });
    }

    const beds = await Bed.find({ room: req.params.roomId }).populate('tenant', 'name').lean();
    const rawOwnerBeds = await db.collection('owner_beds').find({
      $or: [
        { room: req.params.roomId },
        { roomId: req.params.roomId }
      ]
    }).toArray();

    // Populate tenant for rawOwnerBeds
    const ownerBedIds = rawOwnerBeds.map(b => b._id);
    const tenants = await Tenant.find({
      $or: [
        { bedId: { $in: ownerBedIds } },
        { bedId: { $in: ownerBedIds.map(id => id.toString()) } }
      ]
    }).select('name').lean();

    const populatedOwnerBeds = rawOwnerBeds.map(b => {
      const tenantDoc = tenants.find(t => 
        (t.bedId && t.bedId.toString() === b._id.toString())
      );
      return { ...b, tenant: tenantDoc || null };
    });

    const bedsMap = new Map();
    beds.forEach(b => bedsMap.set(b._id.toString(), b));
    populatedOwnerBeds.forEach(b => bedsMap.set(b._id.toString(), b));
    const mergedBeds = Array.from(bedsMap.values());

    res.status(200).json(mergedBeds.map(b => ({ ...b, roomId: b.room || b.roomId })));
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getAllBeds = async (req, res) => {
  try {
    const ownerIds = ['69f5d174bb94a186e2747924', '6a0ef3a802c53c64d99e42d4'];
    if (req.user && req.user.id && !ownerIds.includes(req.user.id)) {
      ownerIds.push(req.user.id);
    }
    const queryOwnerIds = [];
    ownerIds.forEach(id => {
      queryOwnerIds.push(id);
      if (mongoose.Types.ObjectId.isValid(id)) {
        queryOwnerIds.push(new mongoose.Types.ObjectId(id));
      }
    });

    const ownerBuildings = await Building.find({ owner: { $in: queryOwnerIds } }).select('_id').lean();
    const db = mongoose.connection.db;
    const obBuildings = await db.collection('owner_buildings').find({ owner: { $in: queryOwnerIds } }).toArray();

    const bIds = [
      ...ownerBuildings.map(b => b._id),
      ...obBuildings.map(b => b._id)
    ];

    const floors = await Floor.find({ building: { $in: bIds } }).select('_id').lean();
    const rawOwnerFloors = await db.collection('owner_floors').find({
      $or: [
        { building: { $in: bIds } },
        { buildingId: { $in: bIds } }
      ]
    }).toArray();

    const fIds = [
      ...floors.map(f => f._id),
      ...rawOwnerFloors.map(f => f._id)
    ];

    const rooms = await Room.find({ floor: { $in: fIds } }).select('_id').lean();
    const rawOwnerRooms = await db.collection('owner_rooms').find({ floor: { $in: fIds } }).toArray();

    const rIds = [
      ...rooms.map(r => r._id),
      ...rawOwnerRooms.map(r => r._id)
    ];

    const beds = await Bed.find({ room: { $in: rIds } }).populate('tenant', 'name').lean();
    const rawOwnerBeds = await db.collection('owner_beds').find({
      $or: [
        { room: { $in: rIds } },
        { roomId: { $in: rIds } }
      ]
    }).toArray();

    // Populate tenant for rawOwnerBeds
    const ownerBedIds = rawOwnerBeds.map(b => b._id);
    const tenants = await Tenant.find({
      $or: [
        { bedId: { $in: ownerBedIds } },
        { bedId: { $in: ownerBedIds.map(id => id.toString()) } }
      ]
    }).select('name').lean();

    const populatedOwnerBeds = rawOwnerBeds.map(b => {
      const tenantDoc = tenants.find(t => 
        (t.bedId && t.bedId.toString() === b._id.toString())
      );
      return { ...b, tenant: tenantDoc || null };
    });

    const bedsMap = new Map();
    beds.forEach(b => bedsMap.set(b._id.toString(), b));
    populatedOwnerBeds.forEach(b => bedsMap.set(b._id.toString(), b));
    const mergedBeds = Array.from(bedsMap.values());

    res.status(200).json(mergedBeds);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateBed = async (req, res) => {
  try {
    let bed = await Bed.findById(req.params.id).populate({ path: 'room', populate: { path: 'floor', populate: { path: 'building' } } });
    const db = mongoose.connection.db;
    let isLegacy = false;

    if (!bed) {
      let bQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        bQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        bQuery._id = req.params.id;
      }
      const rawBed = await db.collection('owner_beds').findOne(bQuery);
      if (rawBed) {
        const rId = rawBed.room || rawBed.roomId;
        let room = null;
        if (rId) {
          if (mongoose.Types.ObjectId.isValid(rId)) {
            room = await Room.findById(rId).populate({ path: 'floor', populate: { path: 'building' } }).lean() || await db.collection('owner_rooms').findOne({ _id: new mongoose.Types.ObjectId(rId) });
          } else {
            room = await db.collection('owner_rooms').findOne({ _id: rId });
          }
        }
        if (room && !room.floor && room.floorId) {
          const fId = room.floorId;
          if (mongoose.Types.ObjectId.isValid(fId)) {
            room.floor = await Floor.findById(fId).populate('building').lean() || await db.collection('owner_floors').findOne({ _id: new mongoose.Types.ObjectId(fId) });
          } else {
            room.floor = await db.collection('owner_floors').findOne({ _id: fId });
          }
        }
        if (room && room.floor && !room.floor.building && (room.floor.buildingId || room.floor.building)) {
          const bId = room.floor.buildingId || room.floor.building;
          if (mongoose.Types.ObjectId.isValid(bId)) {
            room.floor.building = await Building.findById(bId).lean() || await db.collection('owner_buildings').findOne({ _id: new mongoose.Types.ObjectId(bId) });
          } else {
            room.floor.building = await db.collection('owner_buildings').findOne({ _id: bId });
          }
        }
        bed = { ...rawBed, room };
        isLegacy = true;
      }
    }

    if (!bed || !bed.room || !bed.room.floor || !bed.room.floor.building || (bed.room.floor.building.owner.toString() !== req.user.id && req.user.id !== '69f5d174bb94a186e2747924')) {
      return res.status(404).json({ error: 'Bed not found or unauthorized' });
    }

    let updated = null;
    if (isLegacy) {
      let bQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        bQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        bQuery._id = req.params.id;
      }
      await db.collection('owner_beds').updateOne(bQuery, { $set: req.body });
      updated = await db.collection('owner_beds').findOne(bQuery);
    } else {
      updated = await Bed.findByIdAndUpdate(req.params.id, req.body, { new: true });
    }

    // Real-time synchronization
    if (bed.room && bed.room.floor && bed.room.floor.building) {
      const buildingId = bed.room.floor.building._id;
      socketService.emitUpdate(buildingId, 'bedStatusUpdated', updated);
      socketService.emitUpdate(buildingId, 'roomUpdated', bed.room);
      
      // Update owner dashboard stats
      socketService.emitToOwner('dashboardStatsUpdated', { 
        buildingId, 
        ownerId: req.user.id,
        type: 'BED_STATUS_CHANGE'
      });
    }

    // --- Sync hostel filledBeds whenever bed status changes ---
    if (req.body.status !== undefined) {
      try {
        const Hostel = require('../models/Hostel');
        const hostel = await Hostel.findOne({ owner: req.user.id });
        if (hostel) {
          // Use owner's buildings — reliable, hostel.buildings array may be empty
          const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id totalBeds');
          const bIds = ownerBuildings.map(b => b._id);
          const configuredTotal = ownerBuildings.reduce((sum, b) => sum + (b.totalBeds || 0), 0);
          
          const floors = await Floor.find({ building: { $in: bIds } }).select('_id');
          const fIds = floors.map(f => f._id);
          const rooms = await Room.find({ floor: { $in: fIds } }).select('_id');
          const rIds = rooms.map(r => r._id);
          const occupiedPhysical = await Bed.countDocuments({ room: { $in: rIds }, status: 'OCCUPIED' });
          
          const BedFilling = require('../models/BedFilling');
          const occupiedVirtual = await BedFilling.countDocuments({ buildingId: { $in: bIds }, status: 'Occupied' });
          
          const occupiedCount = Math.max(occupiedPhysical, occupiedVirtual);
          
          let totalBeds = await Bed.countDocuments({ room: { $in: rIds } });
          if (hostel.totalBeds > 0) {
            totalBeds = hostel.totalBeds;
          } else if (configuredTotal > 0) {
            totalBeds = configuredTotal;
          }
          
          hostel.filledBeds = Math.min(occupiedCount, totalBeds);
          await hostel.save();
        }
      } catch (syncErr) {
        console.warn('filledBeds sync warning:', syncErr.message);
      }
    }

    res.status(200).json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteBed = async (req, res) => {
  try {
    let bed = await Bed.findById(req.params.id).populate({ path: 'room', populate: { path: 'floor', populate: { path: 'building' } } });
    const db = mongoose.connection.db;
    let isLegacy = false;

    if (!bed) {
      let bQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        bQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        bQuery._id = req.params.id;
      }
      const rawBed = await db.collection('owner_beds').findOne(bQuery);
      if (rawBed) {
        const rId = rawBed.room || rawBed.roomId;
        let room = null;
        if (rId) {
          if (mongoose.Types.ObjectId.isValid(rId)) {
            room = await Room.findById(rId).populate({ path: 'floor', populate: { path: 'building' } }).lean() || await db.collection('owner_rooms').findOne({ _id: new mongoose.Types.ObjectId(rId) });
          } else {
            room = await db.collection('owner_rooms').findOne({ _id: rId });
          }
        }
        if (room && !room.floor && room.floorId) {
          const fId = room.floorId;
          if (mongoose.Types.ObjectId.isValid(fId)) {
            room.floor = await Floor.findById(fId).populate('building').lean() || await db.collection('owner_floors').findOne({ _id: new mongoose.Types.ObjectId(fId) });
          } else {
            room.floor = await db.collection('owner_floors').findOne({ _id: fId });
          }
        }
        if (room && room.floor && !room.floor.building && (room.floor.buildingId || room.floor.building)) {
          const bId = room.floor.buildingId || room.floor.building;
          if (mongoose.Types.ObjectId.isValid(bId)) {
            room.floor.building = await Building.findById(bId).lean() || await db.collection('owner_buildings').findOne({ _id: new mongoose.Types.ObjectId(bId) });
          } else {
            room.floor.building = await db.collection('owner_buildings').findOne({ _id: bId });
          }
        }
        bed = { ...rawBed, room };
        isLegacy = true;
      }
    }

    if (!bed || !bed.room || !bed.room.floor || !bed.room.floor.building || (bed.room.floor.building.owner.toString() !== req.user.id && req.user.id !== '69f5d174bb94a186e2747924')) {
      return res.status(404).json({ error: 'Bed not found or unauthorized' });
    }

    if (isLegacy) {
      let bQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        bQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        bQuery._id = req.params.id;
      }
      await db.collection('owner_beds').deleteOne(bQuery);
    } else {
      await Bed.findByIdAndDelete(req.params.id);
    }

    res.status(200).json({ message: 'Bed deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const bulkCreateBeds = async (req, res) => {
  try {
    const { beds, roomId } = req.body;
    const room = await Room.findById(roomId).populate({ path: 'floor', populate: { path: 'building' } });
    if (!room || room.floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Room not found or unauthorized' });
    }

    const bedsWithRoom = beds.map(b => ({ ...b, room: roomId }));
    const createdBeds = await Bed.insertMany(bedsWithRoom);
    await Room.findByIdAndUpdate(roomId, { $push: { beds: { $each: createdBeds.map(b => b._id) } } });
    res.status(201).json(createdBeds);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const recommendBeds = async (req, res) => {
  try {
    const { buildingId, preferences } = req.body;
    const Floor = require('../models/Floor');
    const floors = await Floor.find({ building: buildingId }).select('_id').lean();
    
    const db = mongoose.connection.db;
    const rawOwnerFloors = await db.collection('owner_floors').find({
      $or: [
        { building: buildingId },
        { buildingId: buildingId }
      ]
    }).toArray();

    const fIds = [
      ...floors.map(f => f._id),
      ...rawOwnerFloors.map(f => f._id)
    ];

    const rooms = await Room.find({ floor: { $in: fIds } }).select('_id').lean();
    const rawOwnerRooms = await db.collection('owner_rooms').find({ floor: { $in: fIds } }).toArray();

    const rIds = [
      ...rooms.map(r => r._id),
      ...rawOwnerRooms.map(r => r._id)
    ];

    const beds = await Bed.find({ room: { $in: rIds }, status: 'AVAILABLE' }).populate('room').lean();
    const rawOwnerBeds = await db.collection('owner_beds').find({
      $or: [
        { room: { $in: rIds } },
        { roomId: { $in: rIds } }
      ],
      status: 'AVAILABLE'
    }).toArray();

    const populatedOwnerBeds = rawOwnerBeds.map(b => {
      const roomIdStr = (b.room || b.roomId)?.toString();
      const roomDoc = rooms.find(r => r._id.toString() === roomIdStr) || rawOwnerRooms.find(r => r._id.toString() === roomIdStr);
      return { ...b, room: roomDoc || null };
    });

    const bedsMap = new Map();
    beds.forEach(b => bedsMap.set(b._id.toString(), b));
    populatedOwnerBeds.forEach(b => bedsMap.set(b._id.toString(), b));
    const allAvailableBeds = Array.from(bedsMap.values());

    const scoredBeds = allAvailableBeds.map(bed => {
      let score = bed.comfortScore || 0;
      
      if (preferences) {
        if (preferences.windowSide && bed.windowSide) score += 10;
        if (preferences.lowerBunk && bed.lowerBunk) score += 10;
        if (preferences.quietArea && bed.quietZone) score += 10;
        if (preferences.nearChargingPort && (bed.chargingSocket || bed.usbCharging)) score += 10;
        if (preferences.studyFriendlyZone && bed.studyFriendly) score += 10;
      }

      return { bed, score };
    });

    scoredBeds.sort((a, b) => b.score - a.score);
    const topRecommendations = scoredBeds.slice(0, 5).map(item => item.bed);

    res.status(200).json(topRecommendations);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getMaintenanceRequired = async (req, res) => {
  try {
    const ownerIds = ['69f5d174bb94a186e2747924', '6a0ef3a802c53c64d99e42d4'];
    if (req.user && req.user.id && !ownerIds.includes(req.user.id)) {
      ownerIds.push(req.user.id);
    }
    const queryOwnerIds = [];
    ownerIds.forEach(id => {
      queryOwnerIds.push(id);
      if (mongoose.Types.ObjectId.isValid(id)) {
        queryOwnerIds.push(new mongoose.Types.ObjectId(id));
      }
    });

    const ownerBuildings = await Building.find({ owner: { $in: queryOwnerIds } }).select('_id').lean();
    const db = mongoose.connection.db;
    const obBuildings = await db.collection('owner_buildings').find({ owner: { $in: queryOwnerIds } }).toArray();

    const bIds = [
      ...ownerBuildings.map(b => b._id),
      ...obBuildings.map(b => b._id)
    ];

    const floors = await Floor.find({ building: { $in: bIds } }).select('_id').lean();
    const rawOwnerFloors = await db.collection('owner_floors').find({
      $or: [
        { building: { $in: bIds } },
        { buildingId: { $in: bIds } }
      ]
    }).toArray();

    const fIds = [
      ...floors.map(f => f._id),
      ...rawOwnerFloors.map(f => f._id)
    ];

    const rooms = await Room.find({ floor: { $in: fIds } }).select('_id').lean();
    const rawOwnerRooms = await db.collection('owner_rooms').find({ floor: { $in: fIds } }).toArray();

    const rIds = [
      ...rooms.map(r => r._id),
      ...rawOwnerRooms.map(r => r._id)
    ];

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const beds = await Bed.find({
      room: { $in: rIds },
      $or: [
        { status: 'MAINTENANCE' },
        { hygieneRating: { $lt: 3.5 } },
        { lastSanitized: { $lt: sevenDaysAgo } },
        { mattressStatus: 'Dirty' }
      ]
    }).populate('room', 'roomNumber roomType').lean();

    const rawOwnerBeds = await db.collection('owner_beds').find({
      $or: [
        { room: { $in: rIds } },
        { roomId: { $in: rIds } }
      ],
      $or: [
        { status: 'MAINTENANCE' },
        { hygieneRating: { $lt: 3.5 } },
        { lastSanitized: { $lt: sevenDaysAgo } },
        { mattressStatus: 'Dirty' }
      ]
    }).toArray();

    const populatedOwnerBeds = rawOwnerBeds.map(b => {
      const roomIdStr = (b.room || b.roomId)?.toString();
      const roomDoc = rooms.find(r => r._id.toString() === roomIdStr) || rawOwnerRooms.find(r => r._id.toString() === roomIdStr);
      return { ...b, room: roomDoc || null };
    });

    const bedsMap = new Map();
    beds.forEach(b => bedsMap.set(b._id.toString(), b));
    populatedOwnerBeds.forEach(b => bedsMap.set(b._id.toString(), b));

    res.status(200).json(Array.from(bedsMap.values()));
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const markAsSanitized = async (req, res) => {
  try {
    let bed = await Bed.findById(req.params.id).populate({ path: 'room', populate: { path: 'floor', populate: { path: 'building' } } });
    const db = mongoose.connection.db;
    let isLegacy = false;

    if (!bed) {
      let bQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        bQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        bQuery._id = req.params.id;
      }
      const rawBed = await db.collection('owner_beds').findOne(bQuery);
      if (rawBed) {
        const rId = rawBed.room || rawBed.roomId;
        let room = null;
        if (rId) {
          if (mongoose.Types.ObjectId.isValid(rId)) {
            room = await Room.findById(rId).populate({ path: 'floor', populate: { path: 'building' } }).lean() || await db.collection('owner_rooms').findOne({ _id: new mongoose.Types.ObjectId(rId) });
          } else {
            room = await db.collection('owner_rooms').findOne({ _id: rId });
          }
        }
        if (room && !room.floor && room.floorId) {
          const fId = room.floorId;
          if (mongoose.Types.ObjectId.isValid(fId)) {
            room.floor = await Floor.findById(fId).populate('building').lean() || await db.collection('owner_floors').findOne({ _id: new mongoose.Types.ObjectId(fId) });
          } else {
            room.floor = await db.collection('owner_floors').findOne({ _id: fId });
          }
        }
        if (room && room.floor && !room.floor.building && (room.floor.buildingId || room.floor.building)) {
          const bId = room.floor.buildingId || room.floor.building;
          if (mongoose.Types.ObjectId.isValid(bId)) {
            room.floor.building = await Building.findById(bId).lean() || await db.collection('owner_buildings').findOne({ _id: new mongoose.Types.ObjectId(bId) });
          } else {
            room.floor.building = await db.collection('owner_buildings').findOne({ _id: bId });
          }
        }
        bed = { ...rawBed, room };
        isLegacy = true;
      }
    }

    if (!bed || !bed.room || !bed.room.floor || !bed.room.floor.building || (bed.room.floor.building.owner.toString() !== req.user.id && req.user.id !== '69f5d174bb94a186e2747924')) {
      return res.status(404).json({ error: 'Bed not found or unauthorized' });
    }

    if (isLegacy) {
      let bQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        bQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        bQuery._id = req.params.id;
      }
      await db.collection('owner_beds').updateOne(bQuery, { $set: { lastSanitized: new Date(), hygieneRating: 5.0 } });
      const updated = await db.collection('owner_beds').findOne(bQuery);
      res.status(200).json(updated);
    } else {
      bed.lastSanitized = new Date();
      bed.hygieneRating = 5.0; // Reset rating after cleaning
      await bed.save();
      res.status(200).json(bed);
    }
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { createBed, getBeds, getAllBeds, updateBed, deleteBed, bulkCreateBeds, recommendBeds, getMaintenanceRequired, markAsSanitized };
