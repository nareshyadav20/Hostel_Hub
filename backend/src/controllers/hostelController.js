const Hostel = require('../models/Hostel');

exports.createHostel = async (req, res) => {
  try {
    const hostel = await Hostel.create({ ...req.body, owner: req.user.id });
    res.status(201).json(hostel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ owner: req.user.id });
    res.status(200).json(hostels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(hostel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHostel = async (req, res) => {
  try {
    await Hostel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Hostel deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
