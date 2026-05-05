const SystemSettings = require('../models/SystemSettings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await SystemSettings.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = await SystemSettings.create(req.body);
    } else {
      settings = await SystemSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
