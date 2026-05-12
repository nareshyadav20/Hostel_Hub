const Inventory = require('../models/Inventory');
const Building = require('../models/Building');

exports.getInventory = async (req, res) => {
  try {
    const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id');
    const bIds = ownerBuildings.map(b => b._id);

    const { buildingId } = req.query;
    let query;
    
    if (buildingId) {
      const isOwned = bIds.some(id => id.toString() === buildingId);
      if (!isOwned) return res.status(403).json({ error: 'Access denied to this building.' });
      query = { buildingId };
    } else {
      query = { buildingId: { $in: bIds } };
    }

    const items = await Inventory.find(query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addInventoryItem = async (req, res) => {
  try {
    const { buildingId } = req.body;
    if (!buildingId) return res.status(400).json({ error: 'buildingId is required' });
    
    const building = await Building.findOne({ _id: buildingId, owner: req.user.id });
    if (!building) return res.status(403).json({ error: 'Access denied to this building.' });

    const data = { ...req.body, lastUpdatedBy: req.user.id };
    
    // Auto-map type based on common hostel categories if not provided
    if (!data.type) {
      if (data.categoryId === 'CAT-FURN' || data.categoryId === 'CAT-ELEC' || data.category === 'Furniture' || data.category === 'Electronics') {
        data.type = 'Asset';
      } else {
        data.type = 'Consumable';
      }
    }

    const newItem = new Inventory(data);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const existingItem = await Inventory.findById(req.params.id);
    if (!existingItem) return res.status(404).json({ error: 'Item not found' });
    
    const building = await Building.findOne({ _id: existingItem.buildingId, owner: req.user.id });
    if (!building) return res.status(403).json({ error: 'Access denied' });

    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    const existingItem = await Inventory.findById(req.params.id);
    if (!existingItem) return res.status(404).json({ error: 'Item not found' });
    
    const building = await Building.findOne({ _id: existingItem.buildingId, owner: req.user.id });
    if (!building) return res.status(403).json({ error: 'Access denied' });

    await Inventory.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
