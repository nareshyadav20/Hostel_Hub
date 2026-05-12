const Staff = require('../models/Staff');
const Building = require('../models/Building');

exports.getAllStaff = async (req, res) => {
  try {
    const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id');
    const bIds = ownerBuildings.map(b => b._id);
    const { buildingId } = req.query;
    let query = {};
    
    if (buildingId) {
      const isOwned = bIds.some(id => id.toString() === buildingId);
      if (!isOwned) return res.status(403).json({ error: 'Access denied to this building.' });
      query = { buildingId };
    } else {
      query = { buildingId: { $in: bIds } };
    }
    
    const staff = await Staff.find(query);
    res.status(200).json({ staffList: staff, totalStaff: staff.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    
    const building = await Building.findOne({ _id: staff.buildingId, owner: req.user.id });
    if (!building) return res.status(403).json({ error: 'Access denied' });
    
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const buildingId = req.body.buildingId;
    if (!buildingId) return res.status(400).json({ message: 'buildingId is required' });
    
    const building = await Building.findOne({ _id: buildingId, owner: req.user.id });
    if (!building) return res.status(403).json({ error: 'Access denied to this building.' });
    
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const existingStaff = await Staff.findById(req.params.id);
    if (!existingStaff) return res.status(404).json({ message: 'Staff not found' });
    
    const building = await Building.findOne({ _id: existingStaff.buildingId, owner: req.user.id });
    if (!building) return res.status(403).json({ error: 'Access denied' });
    
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const existingStaff = await Staff.findById(req.params.id);
    if (!existingStaff) return res.status(404).json({ message: 'Staff not found' });
    
    const building = await Building.findOne({ _id: existingStaff.buildingId, owner: req.user.id });
    if (!building) return res.status(403).json({ error: 'Access denied' });
    
    await Staff.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addActivity = async (req, res) => {
  try {
    const existingStaff = await Staff.findById(req.params.id);
    if (!existingStaff) return res.status(404).json({ message: 'Staff not found' });
    
    const building = await Building.findOne({ _id: existingStaff.buildingId, owner: req.user.id });
    if (!building) return res.status(403).json({ error: 'Access denied' });
    
    const { action } = req.body;
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { $push: { activityLog: { $each: [{ action, time: new Date() }], $position: 0, $slice: 10 } } },
      { new: true }
    );
    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
