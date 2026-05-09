const SystemSettings = require('../models/SystemSettings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne({ owner: req.user.id });
    if (!settings) {
      // Create default settings if none exist for this owner
      settings = await SystemSettings.create({ owner: req.user.id });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOneAndUpdate(
      { owner: req.user.id },
      { ...req.body, owner: req.user.id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
