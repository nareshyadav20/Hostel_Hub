const Tenant = require('../models/Tenant');
const socketService = require('../utils/socketService');

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
    
    // Real-time synchronization
    socketService.emitUpdate(req.body.buildingId, 'tenantAdded', tenant);
    socketService.emitUpdate(req.body.buildingId, 'dashboardStatsUpdated', {});
    
    res.status(201).json(tenant);
  } catch (err) {
    if (err.code === 11000 && err.keyValue && err.keyValue.email) {
      return res.status(400).json({ error: 'A tenant with this email address is already registered in the system.' });
    }
    if (err.code === 11000) {
      return res.status(400).json({ error: 'A tenant with these details already exists.' });
    }
    res.status(400).json({ error: err.message });
  }
};

const getTenants = async (req, res) => {
  try {
    const Building = require('../models/Building');
    const isPlatformAdmin = req.user && req.user.role && ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role.toUpperCase());
    
    let buildingIds = [];
    if (!isPlatformAdmin) {
      const userBuildings = await Building.find({ owner: req.user.id }).select('_id');
      buildingIds = userBuildings.map(b => b._id);
    }

    // If a specific buildingId is requested, validate ownership then filter
    const { buildingId } = req.query;
    let query;
    if (buildingId) {
      if (!isPlatformAdmin) {
        const isOwned = buildingIds.some(id => id.toString() === buildingId);
        if (!isOwned) return res.status(403).json({ error: 'Access denied to this building.' });
      }
      query = { buildingId };
    } else {
      query = isPlatformAdmin ? {} : { buildingId: { $in: buildingIds } };
    }

    const tenants = await Tenant.find(query).lean();
    res.status(200).json(tenants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const bulkCreateTenants = async (req, res) => {
  try {
    const { tenants } = req.body;
    const created = await Tenant.insertMany(tenants);
    
    if (tenants.length > 0 && tenants[0].buildingId) {
      socketService.emitUpdate(tenants[0].buildingId, 'tenantAdded', created);
      socketService.emitUpdate(tenants[0].buildingId, 'dashboardStatsUpdated', {});
    }
    
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'One or more tenants already exist with this registered email address.' });
    }
    res.status(400).json({ error: err.message });
  }
};

const updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (tenant) {
      socketService.emitUpdate(tenant.buildingId, 'tenantUpdated', tenant);
      socketService.emitUpdate(tenant.buildingId, 'dashboardStatsUpdated', {});
    }
    
    res.status(200).json(tenant);
  } catch (err) {
    if (err.code === 11000 && err.keyValue && err.keyValue.email) {
      return res.status(400).json({ error: 'Another tenant with this email address is already registered in the system.' });
    }
    if (err.code === 11000) {
      return res.status(400).json({ error: 'A tenant with these details already exists.' });
    }
    res.status(400).json({ error: err.message });
  }
};

const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (tenant) {
      await Tenant.findByIdAndDelete(req.params.id);
      socketService.emitUpdate(tenant.buildingId, 'tenantDeleted', { id: req.params.id });
      socketService.emitUpdate(tenant.buildingId, 'dashboardStatsUpdated', {});
    }
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
