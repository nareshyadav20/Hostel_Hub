const Room = require('../models/Room');
const Floor = require('../models/Floor');
const Building = require('../models/Building');

const createRoom = async (req, res) => {
  try {
    const { floorId, roomNumber, roomType, capacity, rentAmount, securityDeposit, noticePeriod, isAC, washroomType, balcony, facing, floorType, windowCount, furniture, images } = req.body;
    
    const floor = await Floor.findById(floorId).populate('building');
    if (!floor || floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Floor not found or unauthorized' });
    }

    const room = await Room.create({ 
      roomNumber, roomType, capacity, rentAmount, securityDeposit, noticePeriod,
      isAC, washroomType, balcony, facing, floorType, windowCount, furniture, images: images||[], 
      floor: floorId 
    });
    floor.rooms.push(room._id);
    await floor.save();
    res.status(201).json(room);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getRooms = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.floorId).populate('building');
    if (!floor || floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Floor not found or unauthorized' });
    }
    const rooms = await Room.find({ floor: req.params.floorId }).populate('beds');
    res.status(200).json(rooms);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getAllRooms = async (req, res) => {
  try {
    const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id');
    const bIds = ownerBuildings.map(b => b._id);
    const floors = await Floor.find({ building: { $in: bIds } }).select('_id');
    const fIds = floors.map(f => f._id);
    const rooms = await Room.find({ floor: { $in: fIds } }).populate('beds');
    res.status(200).json(rooms);
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
    const room = await Room.findById(req.params.id).populate({ path: 'floor', populate: { path: 'building' } });
    if (!room || room.floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Room not found or unauthorized' });
    }
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate({ path: 'floor', populate: { path: 'building' } });
    if (!room || room.floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Room not found or unauthorized' });
    }
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { createRoom, getRooms, getAllRooms, bulkCreateRooms, updateRoom, deleteRoom };
