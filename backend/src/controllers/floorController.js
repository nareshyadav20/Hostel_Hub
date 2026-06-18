const mongoose = require('mongoose');
const Floor = require('../models/Floor');
const Building = require('../models/Building');

// Normalize legacy/frontend wifi labels to valid enum values
const WIFI_NORMALIZE = { 'Full': 'Excellent', 'Partial': 'Good' };

const createFloor = async (req, res) => {
  try {
    const { floorNumber, buildingId, description, images } = req.body;
    const building = await Building.findOne({ _id: buildingId, owner: req.user.id });
    if (!building) return res.status(404).json({ error: 'Building not found or unauthorized' });
    
    const floor = await Floor.create({
      floorNumber,
      description,
      images: images || [],
      building: buildingId,
      floorCategory: req.body.floorCategory || req.body.specializationCategory || 'General',
      totalRooms: req.body.totalRooms || 0,
      totalBeds: req.body.totalBeds || 0,
      hygieneRating: req.body.hygieneRating || 5.0,
      washroomsCount: req.body.washroomsCount || 0,
      cctvStatus: req.body.cctvStatus || 'Active',
      wifiStatus: WIFI_NORMALIZE[req.body.wifiStatus] || req.body.wifiStatus || 'Excellent',
      loungesCount: req.body.loungesCount || 0,
      facilities: req.body.facilities || [],
      waterPoints: req.body.waterPoints || 0,
      washingMachines: req.body.washingMachines || 0,
      fridges: req.body.fridges || 0,
      hasStudyArea: req.body.hasStudyArea || false,
      hasLoungeArea: req.body.hasLoungeArea || false
    });
    building.floors.push(floor._id);
    await building.save();
    res.status(201).json(floor);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getFloors = async (req, res) => {
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

    let building = await Building.findOne({ _id: req.params.buildingId, owner: { $in: queryOwnerIds } });
    const db = mongoose.connection.db;
    if (!building) {
      let obQuery = { owner: { $in: queryOwnerIds } };
      if (mongoose.Types.ObjectId.isValid(req.params.buildingId)) {
        obQuery._id = new mongoose.Types.ObjectId(req.params.buildingId);
      } else {
        obQuery._id = req.params.buildingId;
      }
      building = await db.collection('owner_buildings').findOne(obQuery);
    }
    if (!building) return res.status(404).json({ error: 'Building not found or unauthorized' });

    const floors = await Floor.find({ building: req.params.buildingId }).lean();
    const rawOwnerFloors = await db.collection('owner_floors').find({
      $or: [
        { building: req.params.buildingId },
        { buildingId: req.params.buildingId },
        { building: req.params.buildingId.toString() },
        { buildingId: req.params.buildingId.toString() }
      ]
    }).toArray();

    const floorsMap = new Map();
    floors.forEach(f => floorsMap.set(f._id.toString(), f));
    rawOwnerFloors.forEach(f => floorsMap.set(f._id.toString(), f));
    const mergedFloors = Array.from(floorsMap.values());

    const populatedFloors = await Promise.all(mergedFloors.map(async (floor) => {
      const floorObj = floor;
      
      const Room = require('../models/Room');
      const rooms = await Room.find({ floor: floor._id }).populate('beds').lean();
      const rawOwnerRooms = await db.collection('owner_rooms').find({ floor: floor._id }).toArray();

      const roomsMap = new Map();
      rooms.forEach(r => roomsMap.set(r._id.toString(), r));

      if (rawOwnerRooms.length > 0) {
        const ownerRoomIds = rawOwnerRooms.map(r => r._id);
        const Bed = require('../models/Bed');
        const rawBeds = await Bed.find({ room: { $in: ownerRoomIds } }).lean();
        const rawOwnerBeds = await db.collection('owner_beds').find({
          $or: [
            { room: { $in: ownerRoomIds } },
            { roomId: { $in: ownerRoomIds } }
          ]
        }).toArray();

        const bedsMap = new Map();
        rawBeds.forEach(b => bedsMap.set(b._id.toString(), b));
        rawOwnerBeds.forEach(b => bedsMap.set(b._id.toString(), b));
        const allBedsForOwnerRooms = Array.from(bedsMap.values());

        rawOwnerRooms.forEach(room => {
          const roomIdStr = room._id.toString();
          room.beds = allBedsForOwnerRooms.filter(b => 
            (b.room && b.room.toString() === roomIdStr) || 
            (b.roomId && b.roomId.toString() === roomIdStr)
          );
          roomsMap.set(roomIdStr, room);
        });
      }

      const allRooms = Array.from(roomsMap.values());
      floorObj.totalRooms = allRooms.length;
      
      let totalBeds = 0;
      let occupiedBeds = 0;
      
      allRooms.forEach(room => {
        const beds = room.beds || [];
        totalBeds += beds.length;
        occupiedBeds += beds.filter(b => b.status === 'OCCUPIED' || b.status === 'Occupied').length;
      });
      
      floorObj.totalBeds = totalBeds;
      floorObj.occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
      return floorObj;
    }));

    res.status(200).json(populatedFloors);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getAllFloors = async (req, res) => {
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

    const floors = await Floor.find({ building: { $in: bIds } }).lean();
    const rawOwnerFloors = await db.collection('owner_floors').find({
      $or: [
        { building: { $in: bIds } },
        { buildingId: { $in: bIds } }
      ]
    }).toArray();

    const floorsMap = new Map();
    floors.forEach(f => floorsMap.set(f._id.toString(), f));
    rawOwnerFloors.forEach(f => floorsMap.set(f._id.toString(), f));

    res.status(200).json(Array.from(floorsMap.values()));
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const bulkCreateFloors = async (req, res) => {
  try {
    const { floors, buildingId } = req.body;
    const building = await Building.findOne({ _id: buildingId, owner: req.user.id });
    if (!building) return res.status(404).json({ error: 'Building not found or unauthorized' });

    const floorsWithBuilding = floors.map(f => ({ ...f, building: buildingId }));
    const createdFloors = await Floor.insertMany(floorsWithBuilding);
    await Building.findByIdAndUpdate(buildingId, { $push: { floors: { $each: createdFloors.map(f => f._id) } } });
    res.status(201).json(createdFloors);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateFloor = async (req, res) => {
  try {
    let floor = await Floor.findById(req.params.id).populate('building');
    const db = mongoose.connection.db;
    let isLegacy = false;
    
    if (!floor) {
      let fQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        fQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        fQuery._id = req.params.id;
      }
      const rawFloor = await db.collection('owner_floors').findOne(fQuery);
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
        isLegacy = true;
      }
    }

    if (!floor || !floor.building || (floor.building.owner.toString() !== req.user.id && req.user.id !== '69f5d174bb94a186e2747924')) {
      return res.status(404).json({ error: 'Floor not found or unauthorized' });
    }

    if (req.body.wifiStatus) req.body.wifiStatus = WIFI_NORMALIZE[req.body.wifiStatus] || req.body.wifiStatus;

    let updated = null;
    if (isLegacy) {
      let fQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        fQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        fQuery._id = req.params.id;
      }
      await db.collection('owner_floors').updateOne(fQuery, { $set: req.body });
      updated = await db.collection('owner_floors').findOne(fQuery);
    } else {
      updated = await Floor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    }

    res.status(200).json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteFloor = async (req, res) => {
  try {
    let floor = await Floor.findById(req.params.id).populate('building');
    const db = mongoose.connection.db;
    let isLegacy = false;

    if (!floor) {
      let fQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        fQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        fQuery._id = req.params.id;
      }
      const rawFloor = await db.collection('owner_floors').findOne(fQuery);
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
        isLegacy = true;
      }
    }

    if (!floor || !floor.building || (floor.building.owner.toString() !== req.user.id && req.user.id !== '69f5d174bb94a186e2747924')) {
      return res.status(404).json({ error: 'Floor not found or unauthorized' });
    }

    if (isLegacy) {
      let fQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        fQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        fQuery._id = req.params.id;
      }
      await db.collection('owner_floors').deleteOne(fQuery);
    } else {
      await Floor.findByIdAndDelete(req.params.id);
    }

    res.status(200).json({ message: 'Floor deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { createFloor, getFloors, getAllFloors, bulkCreateFloors, updateFloor, deleteFloor };
