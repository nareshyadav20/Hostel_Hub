const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const query = buildingId ? { buildingId } : {};
    const items = await Inventory.find(query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addInventoryItem = async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
