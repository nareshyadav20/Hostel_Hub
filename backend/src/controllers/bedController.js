const Bed = require('../models/Bed');
const Room = require('../models/Room');
const Floor = require('../models/Floor');
const Building = require('../models/Building');

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

const recommendBeds = async (req, res) => {
  try {
    const { buildingId, preferences } = req.body;
    // preferences: { windowSide, lowerBunk, quietArea, nearChargingPort, studyFriendlyZone }
    
    // Find rooms in this building
    const Floor = require('../models/Floor');
    const floors = await Floor.find({ building: buildingId }).select('_id');
    const fIds = floors.map(f => f._id);
    const rooms = await Room.find({ floor: { $in: fIds } }).select('_id');
    const rIds = rooms.map(r => r._id);

    // Find available beds
    const beds = await Bed.find({ room: { $in: rIds }, status: 'AVAILABLE' }).populate('room');

    // Simple rule-based scoring algorithm to simulate AI recommendation
    const scoredBeds = beds.map(bed => {
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

    // Sort by score descending and return top 5
    scoredBeds.sort((a, b) => b.score - a.score);
    const topRecommendations = scoredBeds.slice(0, 5).map(item => item.bed);

    res.status(200).json(topRecommendations);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getMaintenanceRequired = async (req, res) => {
  try {
    const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id');
    const bIds = ownerBuildings.map(b => b._id);
    const floors = await Floor.find({ building: { $in: bIds } }).select('_id');
    const fIds = floors.map(f => f._id);
    const rooms = await Room.find({ floor: { $in: fIds } }).select('_id');
    const rIds = rooms.map(r => r._id);

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
    }).populate('room', 'roomNumber roomType');

    res.status(200).json(beds);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const markAsSanitized = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id).populate({ path: 'room', populate: { path: 'floor', populate: { path: 'building' } } });
    if (!bed || bed.room.floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Bed not found or unauthorized' });
    }
    bed.lastSanitized = new Date();
    bed.hygieneRating = 5.0; // Reset rating after cleaning
    await bed.save();
    res.status(200).json(bed);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { createBed, getBeds, getAllBeds, updateBed, deleteBed, bulkCreateBeds, recommendBeds, getMaintenanceRequired, markAsSanitized };
