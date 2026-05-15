const PurchaseRequest = require('../models/PurchaseRequest');
const PurchaseOrder = require('../models/PurchaseOrder');
const Building = require('../models/Building');

exports.getProcurementData = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id');
    const bIds = ownerBuildings.map(b => b._id);

    let query;
    const isValidBuildingId = buildingId && 
                             buildingId !== 'undefined' && 
                             buildingId !== 'null' && 
                             require('mongoose').Types.ObjectId.isValid(buildingId);

    if (isValidBuildingId) {
      if (!bIds.some(id => id.toString() === buildingId)) return res.status(403).json({ error: 'Denied' });
      query = { buildingId };
    } else {
      query = { buildingId: { $in: bIds } };
    }

    const [requests, pos] = await Promise.all([
      PurchaseRequest.find(query).sort({ createdAt: -1 }),
      PurchaseOrder.find(query).sort({ createdAt: -1 })
    ]);

    res.json({ requests, pos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addPurchaseRequest = async (req, res) => {
  try {
    const request = new PurchaseRequest({ ...req.body, owner: req.user.id });
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addPurchaseOrder = async (req, res) => {
  try {
    const po = new PurchaseOrder({ ...req.body, owner: req.user.id });
    await po.save();
    res.status(201).json(po);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
