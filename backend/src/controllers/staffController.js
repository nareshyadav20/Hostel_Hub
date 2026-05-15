const Staff = require('../models/Staff');

exports.getAllStaff = async (req, res) => {
  try {
    const { buildingId } = req.query;
    let query = {};
    
    const isValidId = buildingId && buildingId !== 'undefined' && buildingId !== 'null' && require('mongoose').Types.ObjectId.isValid(buildingId);

    if (isValidId) {
      query = { buildingId };
    } else {
      const Building = require('../models/Building');
      const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id');
      const bIds = ownerBuildings.map(b => b._id);
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
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addActivity = async (req, res) => {
  try {
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
