const mongoose = require('mongoose');
const Floor = require('../models/Floor');
const Building = require('../models/Building');
const Room = require('../models/Room');
const Bed = require('../models/Bed');

// Normalize legacy/frontend wifi labels to valid enum values
const WIFI_NORMALIZE = { 'Full': 'Excellent', 'Partial': 'Good' };

const createFloor = async (req, res) => {
  try {
    const { floorNumber, buildingId, description, images } = req.body;
    const building = await Building.findOne({ _id: buildingId, owner: req.user.id });
    if (!building) return res.status(404).json({ error: 'Building not found or unauthorized' });
    if (building.approvalStatus !== 'approved' && building.status !== 'Active') {
      return res.status(403).json({ error: 'Cannot add floors to an unapproved property. Please wait for admin approval.' });
    }
    
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
    const queryOwnerIds = ownerIds.flatMap(id => [id, new mongoose.Types.ObjectId(id)]);

    const building = await Building.findOne({ _id: req.params.buildingId, owner: { $in: queryOwnerIds } });
    if (!building) return res.status(404).json({ error: 'Building not found or unauthorized' });

    const floors = await Floor.find({ building: req.params.buildingId }).lean();

    const populatedFloors = await Promise.all(floors.map(async (floor) => {
      const rooms = await Room.find({ floor: floor._id }).populate('beds').lean();
      
      let totalRooms = rooms.length;
      let totalBeds = 0;
      let occupiedBeds = 0;
      
      rooms.forEach(room => {
        const roomBeds = room.beds || [];
        totalBeds += roomBeds.length;
        occupiedBeds += roomBeds.filter(b => b.status === 'OCCUPIED' || b.status === 'Occupied').length;
      });

      floor.rooms = rooms;
      floor.totalRooms = totalRooms;
      floor.totalBeds = totalBeds;
      floor.occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
      return floor;
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
    const queryOwnerIds = ownerIds.flatMap(id => [id, new mongoose.Types.ObjectId(id)]);

    const buildings = await Building.find({ owner: { $in: queryOwnerIds } }).select('_id').lean();
    const buildingIds = buildings.map(b => b._id);

    const floors = await Floor.find({ building: { $in: buildingIds } }).lean();

    res.status(200).json(floors);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id);
    if (!floor) return res.status(404).json({ error: 'Floor not found' });

    const ownerIds = ['69f5d174bb94a186e2747924', '6a0ef3a802c53c64d99e42d4'];
    if (req.user && req.user.id && !ownerIds.includes(req.user.id)) {
      ownerIds.push(req.user.id);
    }
    const queryOwnerIds = ownerIds.flatMap(id => [id, new mongoose.Types.ObjectId(id)]);

    const bId = floor.building || floor.buildingId;
    const building = await Building.findOne({ _id: bId, owner: { $in: queryOwnerIds } });

    if (!building && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to update this floor' });
    }

    if (req.body.wifiStatus && WIFI_NORMALIZE[req.body.wifiStatus]) {
      req.body.wifiStatus = WIFI_NORMALIZE[req.body.wifiStatus];
    }
    if (req.body.specializationCategory) {
      req.body.floorCategory = req.body.specializationCategory;
      delete req.body.specializationCategory;
    }

    const updatedFloor = await Floor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedFloor);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id);
    if (!floor) return res.status(404).json({ error: 'Floor not found' });

    const ownerIds = ['69f5d174bb94a186e2747924', '6a0ef3a802c53c64d99e42d4'];
    if (req.user && req.user.id && !ownerIds.includes(req.user.id)) {
      ownerIds.push(req.user.id);
    }
    const queryOwnerIds = ownerIds.flatMap(id => [id, new mongoose.Types.ObjectId(id)]);

    const bId = floor.building || floor.buildingId;
    const building = await Building.findOne({ _id: bId, owner: { $in: queryOwnerIds } });

    if (!building && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to delete this floor' });
    }

    const rooms = await Room.find({ floor: req.params.id }).select('_id').lean();
    const roomIds = rooms.map(r => r._id);

    if (roomIds.length > 0) {
      await Bed.deleteMany({ room: { $in: roomIds } });
      await Room.deleteMany({ floor: req.params.id });
    }

    await Floor.findByIdAndDelete(req.params.id);

    if (building) {
      await Building.updateOne({ _id: bId }, { $pull: { floors: req.params.id } });
    }

    res.status(200).json({ message: 'Floor deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const bulkCreateFloors = async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};

module.exports = { createFloor, getFloors, getAllFloors, updateFloor, deleteFloor, bulkCreateFloors };
