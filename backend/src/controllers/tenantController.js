const Tenant = require('../models/Tenant');

const createTenant = async (req, res) => {
  try {
    const Building = require('../models/Building');
    if (req.body.buildingId) {
      const building = await Building.findOne({ _id: req.body.buildingId, owner: req.user.id });
      if (!building) {
        return res.status(403).json({ error: 'You do not have permission to add tenants to this building.' });
      }
    }
    const tenant = new Tenant(req.body);
    await tenant.save();
    res.status(201).json(tenant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getTenants = async (req, res) => {
  try {
    const Building = require('../models/Building');
    const userBuildings = await Building.find({ owner: req.user.id }).select('_id');
    const buildingIds = userBuildings.map(b => b._id);

    // If a specific buildingId is requested, validate ownership then filter
    const { buildingId } = req.query;
    let query;
    if (buildingId) {
      const isOwned = buildingIds.some(id => id.toString() === buildingId);
      if (!isOwned) return res.status(403).json({ error: 'Access denied to this building.' });
      query = { buildingId };
    } else {
      query = { buildingId: { $in: buildingIds } };
    }

    const tenants = await Tenant.find(query);
    res.status(200).json(tenants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const bulkCreateTenants = async (req, res) => {
  try {
    const { tenants } = req.body;
    if (!tenants || tenants.length === 0) return res.status(400).json({ error: 'No tenants provided' });
    
    const Building = require('../models/Building');
    const buildingId = tenants[0].buildingId;
    
    // Assuming all bulk tenants belong to the same building
    if (buildingId) {
      const building = await Building.findOne({ _id: buildingId, owner: req.user.id });
      if (!building) return res.status(403).json({ error: 'Access denied to this building.' });
    }
    
    const created = await Tenant.insertMany(tenants);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateTenant = async (req, res) => {
  try {
    const existingTenant = await Tenant.findById(req.params.id);
    if (!existingTenant) return res.status(404).json({ error: 'Tenant not found' });
    
    const Building = require('../models/Building');
    const building = await Building.findOne({ _id: existingTenant.buildingId, owner: req.user.id });
    if (!building) return res.status(403).json({ error: 'Access denied' });

    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(tenant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTenant = async (req, res) => {
  try {
    const existingTenant = await Tenant.findById(req.params.id);
    if (!existingTenant) return res.status(404).json({ error: 'Tenant not found' });
    
    const Building = require('../models/Building');
    const building = await Building.findOne({ _id: existingTenant.buildingId, owner: req.user.id });
    if (!building) return res.status(403).json({ error: 'Access denied' });

    await Tenant.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tenant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTenantProfile = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ email: req.user.email })
      .populate({
        path: 'roomId',
        select: 'roomNumber roomType hygieneRating smartLock ventilationScore tempComfortScore studyFriendly'
      })
      .populate({
        path: 'bedId',
        select: 'bedNumber comfortScore lastSanitized position bedType'
      })
      .populate('buildingId', 'name address');
    
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });
    res.status(200).json(tenant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createTenant, getTenants, bulkCreateTenants, updateTenant, deleteTenant, getTenantProfile };
