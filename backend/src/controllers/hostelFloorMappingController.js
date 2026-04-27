const HostelFloorMapping = require('../models/HostelFloorMapping');

const createMapping = async (req, res) => {
  try {
    const { hostelId, floorId, buildingId } = req.body;
    
    // Find and update or create
    const mapping = await HostelFloorMapping.findOneAndUpdate(
      { hostel: hostelId, floor: floorId },
      { building: buildingId },
      { upsert: true, new: true }
    );
    
    res.status(201).json(mapping);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMappings = async (req, res) => {
  try {
    const { hostelId } = req.query;
    if (!hostelId) {
      return res.status(400).json({ error: "hostelId is required" });
    }
    const mappings = await HostelFloorMapping.find({ hostel: hostelId })
      .populate({
        path: 'floor',
        populate: { path: 'building' }
      });
    res.status(200).json(mappings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeMapping = async (req, res) => {
  try {
    const { hostelId, floorId } = req.query;
    await HostelFloorMapping.deleteOne({ hostel: hostelId, floor: floorId });
    res.status(200).json({ message: 'Mapping removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createMapping, getMappings, removeMapping };
