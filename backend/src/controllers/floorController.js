const Floor = require('../models/Floor');
const Building = require('../models/Building');

const createFloor = async (req, res) => {
  try {
    const { floorNumber, buildingId, description, images } = req.body;
    const building = await Building.findOne({ _id: buildingId, owner: req.user.id });
    if (!building) return res.status(404).json({ error: 'Building not found or unauthorized' });
    
    const floor = await Floor.create({ floorNumber, description, images: images||[], buildingId: buildingId });
    building.floors.push(floor._id);
    await building.save();
    res.status(201).json(floor);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getFloors = async (req, res) => {
  try {
    const building = await Building.findOne({ _id: req.params.buildingId, owner: req.user.id });
    if (!building) return res.status(404).json({ error: 'Building not found or unauthorized' });

    const floors = await Floor.find({ buildingId: req.params.buildingId }).populate('rooms');
    res.status(200).json(floors);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getAllFloors = async (req, res) => {
  try {
    const { buildingId } = req.query;
    let query = {};
    
    if (buildingId) {
      // Verify building ownership
      const building = await Building.findOne({ _id: buildingId, owner: req.user.id });
      if (!building) return res.status(404).json({ error: 'Building not found or unauthorized' });
      query = { buildingId: buildingId };
    } else {
      const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id');
      const bIds = ownerBuildings.map(b => b._id);
      query = { buildingId: { $in: bIds } };
    }

    const floors = await Floor.find(query);
    res.status(200).json(floors);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const bulkCreateFloors = async (req, res) => {
  try {
    const { floors, buildingId } = req.body;
    const building = await Building.findOne({ _id: buildingId, owner: req.user.id });
    if (!building) return res.status(404).json({ error: 'Building not found or unauthorized' });

    const floorsWithBuilding = floors.map(f => ({ ...f, buildingId: buildingId }));
    const createdFloors = await Floor.insertMany(floorsWithBuilding);
    await Building.findByIdAndUpdate(buildingId, { $push: { floors: { $each: createdFloors.map(f => f._id) } } });
    res.status(201).json(createdFloors);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id).populate('buildingId');
    if (!floor || floor.buildingId.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Floor not found or unauthorized' });
    }
    const updated = await Floor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id).populate('buildingId');
    if (!floor || floor.buildingId.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Floor not found or unauthorized' });
    }
    await Floor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Floor deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { createFloor, getFloors, getAllFloors, bulkCreateFloors, updateFloor, deleteFloor };
