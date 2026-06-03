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
    const building = await Building.findOne({ _id: req.params.buildingId, owner: req.user.id });
    if (!building) return res.status(404).json({ error: 'Building not found or unauthorized' });

    const floors = await Floor.find({ building: req.params.buildingId });

    const populatedFloors = await Promise.all(floors.map(async (floor) => {
      const floorObj = floor.toObject();
      
      const Room = require('../models/Room');
      const rooms = await Room.find({ floor: floor._id }).populate('beds');
      
      floorObj.totalRooms = rooms.length;
      
      let totalBeds = 0;
      let occupiedBeds = 0;
      
      rooms.forEach(room => {
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
    const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id');
    const bIds = ownerBuildings.map(b => b._id);
    const floors = await Floor.find({ building: { $in: bIds } });
    res.status(200).json(floors);
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
    const floor = await Floor.findById(req.params.id).populate('building');
    if (!floor || floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Floor not found or unauthorized' });
    }
    if (req.body.wifiStatus) req.body.wifiStatus = WIFI_NORMALIZE[req.body.wifiStatus] || req.body.wifiStatus;
    const updated = await Floor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id).populate('building');
    if (!floor || floor.building.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Floor not found or unauthorized' });
    }
    await Floor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Floor deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { createFloor, getFloors, getAllFloors, bulkCreateFloors, updateFloor, deleteFloor };
