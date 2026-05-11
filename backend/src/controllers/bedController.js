const Bed = require('../models/Bed');
const Room = require('../models/Room');
const Floor = require('../models/Floor');
const Building = require('../models/Building');
const socketService = require('../utils/socketService');

const createBed = async (req, res) => {
  try {
    const { bedNumber, roomId, images, position, bedType } = req.body;
    const room = await Room.findById(roomId).populate({ path: 'floor', populate: { path: 'building' } });
    if (!room || room.floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Room not found or unauthorized' });
    }

    const bed = await Bed.create({ 
      bedNumber, status: 'AVAILABLE', images: images||[], 
      position: position||'Standard', bedType: bedType||'Single',
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
    const room = await Room.findById(req.params.roomId).populate({ path: 'floor', populate: { path: 'building' } });
    if (!room || room.floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Room not found or unauthorized' });
    }
    const beds = await Bed.find({ room: req.params.roomId }).populate('tenant', 'name');
    res.status(200).json(beds.map(b => ({ ...b.toObject(), roomId: b.room })));
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getAllBeds = async (req, res) => {
  try {
    const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id');
    const bIds = ownerBuildings.map(b => b._id);
    const floors = await Floor.find({ building: { $in: bIds } }).select('_id');
    const fIds = floors.map(f => f._id);
    const rooms = await Room.find({ floor: { $in: fIds } }).select('_id');
    const rIds = rooms.map(r => r._id);
    const beds = await Bed.find({ room: { $in: rIds } }).populate('tenant', 'name');
    res.status(200).json(beds);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id).populate({ path: 'room', populate: { path: 'floor', populate: { path: 'building' } } });
    if (!bed || bed.room.floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Bed not found or unauthorized' });
    }
    const updated = await Bed.findByIdAndUpdate(req.params.id, req.body, { new: true });

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

    res.status(200).json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id).populate({ path: 'room', populate: { path: 'floor', populate: { path: 'building' } } });
    if (!bed || bed.room.floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Bed not found or unauthorized' });
    }
    await Bed.findByIdAndDelete(req.params.id);
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

module.exports = { createBed, getBeds, getAllBeds, updateBed, deleteBed, bulkCreateBeds };
