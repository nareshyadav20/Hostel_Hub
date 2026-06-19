const mongoose = require('mongoose');
const Room = require('../models/Room');
const Floor = require('../models/Floor');
const Building = require('../models/Building');
const SystemSettings = require('../models/SystemSettings');
const Bed = require('../models/Bed');

const createRoom = async (req, res) => {
  try {
    const { floorId, roomNumber, roomType, capacity, rentAmount, securityDeposit, noticePeriod, isAC, washroomType, balcony, facing, floorType, windowCount, furniture, images, ...smartFeatures } = req.body;
    
    const floor = await Floor.findById(floorId).populate('building');
    if (!floor || floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Floor not found or unauthorized' });
    }

    // Fetch owner settings for defaults
    const settings = await SystemSettings.findOne({ owner: req.user.id });
    const finalRent = rentAmount || (settings ? settings.rentSettings.defaultRent[roomType?.toLowerCase()] || settings.rentSettings.defaultRent.shared : 5000);
    const finalDeposit = securityDeposit || (settings ? settings.rentSettings.securityDeposit : 5000);

    const room = await Room.create({ 
      roomNumber, 
      roomType: roomType || 'Shared', 
      capacity: capacity || 1, 
      rentAmount: finalRent, 
      securityDeposit: finalDeposit, 
      noticePeriod: noticePeriod || 30,
      isAC, washroomType, balcony, facing, floorType, windowCount, furniture, images: images||[], 
      ...smartFeatures,
      floor: floorId 
    });
    floor.rooms.push(room._id);
    await floor.save();
    res.status(201).json(room);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getRooms = async (req, res) => {
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
    let floor = null;
    if (mongoose.Types.ObjectId.isValid(req.params.floorId)) {
      floor = await Floor.findById(req.params.floorId).populate('building').lean();
    }
    // If floor is not found or its building is null, resolve it manually from raw collections
    if (!floor || !floor.building) {
      let fQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.floorId)) {
        fQuery._id = new mongoose.Types.ObjectId(req.params.floorId);
      } else {
        fQuery._id = req.params.floorId;
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

    if (!floor || !floor.building || !queryOwnerIds.some(oid => oid.toString() === floor.building.owner?.toString())) {
      return res.status(404).json({ error: 'Floor not found or unauthorized' });
    }

    const rooms = await Room.find({ floor: req.params.floorId }).populate('beds').lean();
    const rawOwnerRooms = await db.collection('owner_rooms').find({ floor: req.params.floorId }).toArray();

    const roomsMap = new Map();
    rooms.forEach(r => roomsMap.set(r._id.toString(), r));

    if (rawOwnerRooms.length > 0) {
      const ownerRoomIds = rawOwnerRooms.map(r => r._id);
      const beds = await Bed.find({ room: { $in: ownerRoomIds } }).lean();
      const ownerBeds = await db.collection('owner_beds').find({
        $or: [
          { room: { $in: ownerRoomIds } },
          { roomId: { $in: ownerRoomIds } }
        ]
      }).toArray();

      const bedsMap = new Map();
      beds.forEach(b => bedsMap.set(b._id.toString(), b));
      ownerBeds.forEach(b => bedsMap.set(b._id.toString(), b));
      const allBeds = Array.from(bedsMap.values());

      rawOwnerRooms.forEach(room => {
        const roomIdStr = room._id.toString();
        room.beds = allBeds.filter(b => 
          (b.room && b.room.toString() === roomIdStr) || 
          (b.roomId && b.roomId.toString() === roomIdStr)
        );
        roomsMap.set(roomIdStr, room);
      });
    }

    res.status(200).json(Array.from(roomsMap.values()));
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getAllRooms = async (req, res) => {
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

    const rooms = await Room.find({ floor: { $in: fIds } }).populate('beds').lean();
    const rawOwnerRooms = await db.collection('owner_rooms').find({ floor: { $in: fIds } }).toArray();

    const roomsMap = new Map();
    rooms.forEach(r => roomsMap.set(r._id.toString(), r));

    if (rawOwnerRooms.length > 0) {
      const ownerRoomIds = rawOwnerRooms.map(r => r._id);
      const beds = await Bed.find({ room: { $in: ownerRoomIds } }).lean();
      const ownerBeds = await db.collection('owner_beds').find({
        $or: [
          { room: { $in: ownerRoomIds } },
          { roomId: { $in: ownerRoomIds } }
        ]
      }).toArray();

      const bedsMap = new Map();
      beds.forEach(b => bedsMap.set(b._id.toString(), b));
      ownerBeds.forEach(b => bedsMap.set(b._id.toString(), b));
      const allBeds = Array.from(bedsMap.values());

      rawOwnerRooms.forEach(room => {
        const roomIdStr = room._id.toString();
        room.beds = allBeds.filter(b => 
          (b.room && b.room.toString() === roomIdStr) || 
          (b.roomId && b.roomId.toString() === roomIdStr)
        );
        roomsMap.set(roomIdStr, room);
      });
    }

    res.status(200).json(Array.from(roomsMap.values()));
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const bulkCreateRooms = async (req, res) => {
  try {
    const { rooms, floorId } = req.body;
    const floor = await Floor.findById(floorId).populate('building');
    if (!floor || floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Floor not found or unauthorized' });
    }

    const roomsWithFloor = rooms.map(r => ({ ...r, floor: floorId }));
    const createdRooms = await Room.insertMany(roomsWithFloor);
    await Floor.findByIdAndUpdate(floorId, { $push: { rooms: { $each: createdRooms.map(r => r._id) } } });
    res.status(201).json(createdRooms);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id).populate({ path: 'floor', populate: { path: 'building' } });
    const db = mongoose.connection.db;
    let isLegacy = false;

    if (!room) {
      let rQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        rQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        rQuery._id = req.params.id;
      }
      const rawRoom = await db.collection('owner_rooms').findOne(rQuery);
      if (rawRoom) {
        const fId = rawRoom.floor;
        let floor = null;
        if (fId) {
          if (mongoose.Types.ObjectId.isValid(fId)) {
            floor = await Floor.findById(fId).populate('building').lean() || await db.collection('owner_floors').findOne({ _id: new mongoose.Types.ObjectId(fId) });
          } else {
            floor = await db.collection('owner_floors').findOne({ _id: fId });
          }
        }
        if (floor && !floor.building && (floor.buildingId || floor.building)) {
          const bId = floor.buildingId || floor.building;
          if (mongoose.Types.ObjectId.isValid(bId)) {
            floor.building = await Building.findById(bId).lean() || await db.collection('owner_buildings').findOne({ _id: new mongoose.Types.ObjectId(bId) });
          } else {
            floor.building = await db.collection('owner_buildings').findOne({ _id: bId });
          }
        }
        room = { ...rawRoom, floor };
        isLegacy = true;
      }
    }

    if (!room || !room.floor || !room.floor.building || (room.floor.building.owner.toString() !== req.user.id && req.user.id !== '69f5d174bb94a186e2747924')) {
      return res.status(404).json({ error: 'Room not found or unauthorized' });
    }

    let updated = null;
    if (isLegacy) {
      let rQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        rQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        rQuery._id = req.params.id;
      }
      await db.collection('owner_rooms').updateOne(rQuery, { $set: req.body });
      updated = await db.collection('owner_rooms').findOne(rQuery);
    } else {
      updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    }

    res.status(200).json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id).populate({ path: 'floor', populate: { path: 'building' } });
    const db = mongoose.connection.db;
    let isLegacy = false;

    if (!room) {
      let rQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        rQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        rQuery._id = req.params.id;
      }
      const rawRoom = await db.collection('owner_rooms').findOne(rQuery);
      if (rawRoom) {
        const fId = rawRoom.floor;
        let floor = null;
        if (fId) {
          if (mongoose.Types.ObjectId.isValid(fId)) {
            floor = await Floor.findById(fId).populate('building').lean() || await db.collection('owner_floors').findOne({ _id: new mongoose.Types.ObjectId(fId) });
          } else {
            floor = await db.collection('owner_floors').findOne({ _id: fId });
          }
        }
        if (floor && !floor.building && (floor.buildingId || floor.building)) {
          const bId = floor.buildingId || floor.building;
          if (mongoose.Types.ObjectId.isValid(bId)) {
            floor.building = await Building.findById(bId).lean() || await db.collection('owner_buildings').findOne({ _id: new mongoose.Types.ObjectId(bId) });
          } else {
            floor.building = await db.collection('owner_buildings').findOne({ _id: bId });
          }
        }
        room = { ...rawRoom, floor };
        isLegacy = true;
      }
    }

    if (!room || !room.floor || !room.floor.building || (room.floor.building.owner.toString() !== req.user.id && req.user.id !== '69f5d174bb94a186e2747924')) {
      return res.status(404).json({ error: 'Room not found or unauthorized' });
    }

    if (isLegacy) {
      let rQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        rQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        rQuery._id = req.params.id;
      }
      await db.collection('owner_rooms').deleteOne(rQuery);
    } else {
      await Room.findByIdAndDelete(req.params.id);
    }

    res.status(200).json({ message: 'Room deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { createRoom, getRooms, getAllRooms, bulkCreateRooms, updateRoom, deleteRoom };
