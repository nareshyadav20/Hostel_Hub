const notificationService = require('../utils/notificationService');
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { buildingId, portalType, moduleName, priority, isRead } = req.query;
    const filters = {};
    
    // Support for both portals
    if (req.user.role === 'TENANT') {
      const { getOrCreateTenant } = require('../utils/tenantHelper');
      const tenant = await getOrCreateTenant(req.user);
      const tenantId = tenant?._id || req.user.id;
      
      filters.$or = [
        { tenantId: tenantId.toString() },
        { receiverId: tenantId.toString() },
        { target: 'All Tenants' }
      ];
      filters.portalType = 'Tenant';
    } else {
      filters.$or = [
        { owner: req.user.id },
        { portalType: 'Owner' }
      ];
      if (portalType) filters.portalType = portalType;
    }
    
    if (moduleName) filters.moduleName = moduleName;
    if (priority) filters.priority = priority;
    if (isRead !== undefined) filters.isRead = isRead === 'true';

    console.log('Fetching notifications with filters:', filters);
    const notifications = await notificationService.getNotifications(buildingId, filters);
    console.log(`Found ${notifications.length} notifications`);
    res.json(notifications);
  } catch (error) {
    console.error('Error in getNotifications:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const query = { buildingId, isRead: false, archived: false };
    
    if (req.user.role === 'TENANT') {
      const { getOrCreateTenant } = require('../utils/tenantHelper');
      const tenant = await getOrCreateTenant(req.user);
      const tenantId = tenant?._id || req.user.id;

      query.$or = [
        { tenantId: tenantId.toString() },
        { receiverId: tenantId.toString() },
        { target: 'All Tenants' }
      ];
      query.portalType = 'Tenant';
    } else {
      query.$or = [
        { owner: req.user.id },
        { portalType: 'Owner' }
      ];
    }
    
    const count = await Notification.countDocuments(query);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const notification = await notificationService.createNotification({
      ...req.body,
      owner: req.user.id
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role === 'TENANT') {
      const { getOrCreateTenant } = require('../utils/tenantHelper');
      const tenant = await getOrCreateTenant(req.user);
      const tenantId = tenant?._id || req.user.id;
      query.$or = [{ tenantId: tenantId.toString() }, { receiverId: tenantId.toString() }, { target: 'All Tenants' }];
    } else {
      // For owners, allow marking if they own it or if it's meant for the Owner portal
      query.$or = [{ owner: req.user.id }, { portalType: 'Owner' }];
    }
    
    const notification = await Notification.findOneAndUpdate(
      query,
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const { category, buildingId } = req.body;
    const query = { isRead: false };
    
    if (req.user.role === 'TENANT') {
      const { getOrCreateTenant } = require('../utils/tenantHelper');
      const tenant = await getOrCreateTenant(req.user);
      const tenantId = tenant?._id || req.user.id;
      query.$or = [{ tenantId: tenantId.toString() }, { receiverId: tenantId.toString() }, { target: 'All Tenants' }];
    } else {
      query.$or = [{ owner: req.user.id }, { portalType: 'Owner' }];
    }
    
    if (category && category !== 'all') query.category = category;
    if (buildingId) query.buildingId = buildingId;
    
    await Notification.updateMany(query, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.archiveNotification = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role === 'TENANT') {
      const { getOrCreateTenant } = require('../utils/tenantHelper');
      const tenant = await getOrCreateTenant(req.user);
      const tenantId = tenant?._id || req.user.id;
      query.$or = [{ tenantId: tenantId.toString() }, { receiverId: tenantId.toString() }, { target: 'All Tenants' }];
    } else {
      query.$or = [{ owner: req.user.id }, { portalType: 'Owner' }];
    }
    
    const notification = await Notification.findOneAndUpdate(
      query,
      { archived: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role === 'TENANT') {
      const { getOrCreateTenant } = require('../utils/tenantHelper');
      const tenant = await getOrCreateTenant(req.user);
      const tenantId = tenant?._id || req.user.id;
      query.$or = [{ tenantId: tenantId.toString() }, { receiverId: tenantId.toString() }, { target: 'All Tenants' }];
    } else {
      query.$or = [{ owner: req.user.id }, { portalType: 'Owner' }];
    }
    
    const result = await Notification.deleteOne(query);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.seedNotifications = async (req, res) => {
  try {
    const { buildingId } = req.body;
    if (!buildingId) return res.status(400).json({ message: 'buildingId is required' });

    const samples = [];

    for (const s of samples) {
      await notificationService.createNotification(s);
    }

    res.json({ message: 'Centralized notifications seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
