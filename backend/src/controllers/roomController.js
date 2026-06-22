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

    const settings = await SystemSettings.findOne({ owner: req.user.id }).lean();
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
    const queryOwnerIds = ownerIds.flatMap(id => [id, new mongoose.Types.ObjectId(id)]);

    const floor = await Floor.findById(req.params.floorId).populate('building').lean();

    if (!floor || !floor.building || !queryOwnerIds.some(oid => oid.toString() === floor.building.owner?.toString())) {
      return res.status(404).json({ error: 'Floor not found or unauthorized' });
    }

    const rooms = await Room.find({ floor: req.params.floorId }).populate('beds').lean();

    res.status(200).json(rooms);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getAllRooms = async (req, res) => {
  try {
    const ownerIds = ['69f5d174bb94a186e2747924', '6a0ef3a802c53c64d99e42d4'];
    if (req.user && req.user.id && !ownerIds.includes(req.user.id)) {
      ownerIds.push(req.user.id);
    }
    const queryOwnerIds = ownerIds.flatMap(id => [id, new mongoose.Types.ObjectId(id)]);

    const buildings = await Building.find({ owner: { $in: queryOwnerIds } }).select('_id').lean();
    const buildingIds = buildings.map(b => b._id);

    const floors = await Floor.find({ building: { $in: buildingIds } }).select('_id').lean();
    const floorIds = floors.map(f => f._id);

    const rooms = await Room.find({ floor: { $in: floorIds } }).populate('beds').lean();

    res.status(200).json(rooms);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const ownerIds = ['69f5d174bb94a186e2747924', '6a0ef3a802c53c64d99e42d4'];
    if (req.user && req.user.id && !ownerIds.includes(req.user.id)) {
      ownerIds.push(req.user.id);
    }
    const queryOwnerIds = ownerIds.flatMap(id => [id, new mongoose.Types.ObjectId(id)]);

    const floor = await Floor.findById(room.floor).populate('building').lean();

    if (!floor || !floor.building || (!queryOwnerIds.some(oid => oid.toString() === floor.building.owner?.toString()) && req.user.role !== 'SUPER_ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized to update this room' });
    }

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedRoom);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const ownerIds = ['69f5d174bb94a186e2747924', '6a0ef3a802c53c64d99e42d4'];
    if (req.user && req.user.id && !ownerIds.includes(req.user.id)) {
      ownerIds.push(req.user.id);
    }
    const queryOwnerIds = ownerIds.flatMap(id => [id, new mongoose.Types.ObjectId(id)]);

    const floor = await Floor.findById(room.floor).populate('building').lean();

    if (!floor || !floor.building || (!queryOwnerIds.some(oid => oid.toString() === floor.building.owner?.toString()) && req.user.role !== 'SUPER_ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized to delete this room' });
    }

    await Bed.deleteMany({ room: req.params.id });
    await Room.findByIdAndDelete(req.params.id);

    if (floor) {
      await Floor.updateOne({ _id: floor._id }, { $pull: { rooms: req.params.id } });
    }

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const bulkCreateRooms = async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};

module.exports = { createRoom, getRooms, getAllRooms, updateRoom, deleteRoom, bulkCreateRooms };
