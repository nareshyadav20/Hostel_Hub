const Inventory = require('../models/Inventory');
const Building = require('../models/Building');
const socketService = require('../utils/socketService');

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

    // Real-time update using socketService
    if (data.buildingId) {
      socketService.emitUpdate(data.buildingId, 'inventoryAdded', newItem);
    }
    socketService.emitToOwner('inventoryAdded', newItem);

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Real-time update using socketService
    if (item.buildingId) {
      socketService.emitUpdate(item.buildingId.toString(), 'inventoryUpdated', item);
    }
    socketService.emitToOwner('inventoryUpdated', item);

    // Check for Low Stock Notification
    if (item.stock <= item.minThreshold) {
      const notificationService = require('../utils/notificationService');
      await notificationService.createNotification({
        moduleName: 'Inventory',
        portalType: 'Owner',
        category: 'Procurement',
        title: item.stock <= 0 ? 'OUT OF STOCK' : 'Low Stock Alert',
        message: `${item.name} stock is ${item.stock} ${item.unit}. Minimum threshold is ${item.minThreshold}.`,
        priority: item.stock <= 0 ? 'High' : 'Medium',
        type: item.stock <= 0 ? 'error' : 'warning',
        buildingId: item.buildingId,
        actionLink: '/inventory'
      });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await Inventory.findByIdAndDelete(req.params.id);

    // Real-time update using socketService
    if (item.buildingId) {
      socketService.emitUpdate(item.buildingId, 'inventoryDeleted', req.params.id);
    }
    socketService.emitToOwner('inventoryDeleted', req.params.id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
