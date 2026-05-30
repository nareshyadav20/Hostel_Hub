const Floor = require('../models/Floor');
const Building = require('../models/Building');

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
      wifiStatus: req.body.wifiStatus || 'Excellent',
      loungesCount: req.body.loungesCount || 0,
      facilities: req.body.facilities || []
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

    const floors = await Floor.find({ building: req.params.buildingId }).populate('rooms');
    res.status(200).json(floors);
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
    const updated = await Floor.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
