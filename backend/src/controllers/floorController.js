const Floor = require('../models/Floor');
const Room = require('../models/Room');
const Building = require('../models/Building');

const createFloor = async (req, res) => {
  try {
    const { floorNumber, buildingId, description, images } = req.body;
    const building = await Building.findById(buildingId);
    if (!building) return res.status(404).json({ error: 'Building not found' });
    const floor = await Floor.create({ floorNumber, description, images: images||[], building: buildingId });
    building.floors.push(floor._id);
    await building.save();
    res.status(201).json({ ...floor.toObject(), buildingId });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getFloors = async (req, res) => {
  try {
    const floors = await Floor.find({ building: req.params.buildingId }).populate({ path: 'rooms', populate: { path: 'beds' } });
    res.status(200).json(floors.map(f => ({ ...f.toObject(), buildingId: f.building })));
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateFloor = async (req, res) => {
  try {
    const floor = await Floor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!floor) return res.status(404).json({ error: 'Floor not found' });
    res.status(200).json({ ...floor.toObject(), buildingId: floor.building });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id);
    if (!floor) return res.status(404).json({ error: 'Floor not found' });
    if (floor.rooms && floor.rooms.length > 0)
      return res.status(400).json({ error: 'Cannot delete floor with rooms. Delete rooms first.' });
    await Building.findByIdAndUpdate(floor.building, { $pull: { floors: floor._id } });
    await Floor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Floor deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const bulkCreateFloors = async (req, res) => {
  try {
    const { buildingId, floorNumbers } = req.body;
    const building = await Building.findById(buildingId);
    if (!building) return res.status(404).json({ error: 'Building not found' });
    const floorsData = floorNumbers.map(num => ({ floorNumber: num.toString(), building: buildingId }));
    const created = await Floor.insertMany(floorsData);
    building.floors.push(...created.map(f => f._id));
    await building.save();
    res.status(201).json(created.map(f => ({ ...f.toObject(), buildingId })));
  } catch (err) { res.status(400).json({ error: err.message }); }
};

module.exports = { createFloor, getFloors, updateFloor, deleteFloor, bulkCreateFloors };
