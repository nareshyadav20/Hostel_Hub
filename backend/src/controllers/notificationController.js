const notificationService = require('../utils/notificationService');
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { buildingId, portalType, moduleName, priority, isRead } = req.query;
    const filters = {};
    
    // Support for both portals
    if (req.user.role === 'TENANT') {
      filters.$or = [
        { tenantId: req.user.tenantId || req.user.id },
        { target: 'All Tenants', buildingId }
      ];
      filters.portalType = 'Tenant';
    } else {
      filters.owner = req.user.id;
      if (portalType) filters.portalType = portalType;
    }
    
    if (moduleName) filters.moduleName = moduleName;
    if (priority) filters.priority = priority;
    if (isRead !== undefined) filters.isRead = isRead === 'true';

    const notifications = await notificationService.getNotifications(buildingId, filters);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const query = { buildingId, isRead: false, archived: false };
    
    if (req.user.role === 'TENANT') {
      query.$or = [
        { tenantId: req.user.tenantId || req.user.id },
        { target: 'All Tenants' }
      ];
      query.portalType = 'Tenant';
    } else {
      query.owner = req.user.id;
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
      query.$or = [{ tenantId: req.user.tenantId || req.user.id }, { target: 'All Tenants' }];
    } else {
      query.owner = req.user.id;
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
      query.$or = [{ tenantId: req.user.tenantId || req.user.id }, { target: 'All Tenants' }];
    } else {
      query.owner = req.user.id;
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
      query.$or = [{ tenantId: req.user.tenantId || req.user.id }, { target: 'All Tenants' }];
    } else {
      query.owner = req.user.id;
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
      query.$or = [{ tenantId: req.user.tenantId || req.user.id }, { target: 'All Tenants' }];
    } else {
      query.owner = req.user.id;
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

    const samples = [
      { buildingId, owner: req.user.id, portalType: 'Tenant', moduleName: 'Payments', category: 'Rent', title: 'Rent Received', message: 'Tenant Rahul paid ₹8,500 via UPI.', priority: 'Medium' },
      { buildingId, owner: req.user.id, portalType: 'Tenant', moduleName: 'Complaints', category: 'Maintenance', title: 'Leaking Tap', message: 'Room 204 reported a water leak in the washroom.', priority: 'High' },
      { buildingId, owner: req.user.id, portalType: 'Staff', moduleName: 'Hygiene', category: 'Inspection', title: 'Cleaning Missed', message: 'Floor 2 cleaning was not logged today.', priority: 'Medium' },
      { buildingId, owner: req.user.id, portalType: 'Owner', moduleName: 'Inventory', category: 'Procurement', title: 'Low Stock', message: 'Rice stock is below 10kg. Please reorder.', priority: 'High' },
      { buildingId, owner: req.user.id, portalType: 'Owner', moduleName: 'Security', category: 'Alert', title: 'Late Entry', message: '3 tenants entered after 11:00 PM.', priority: 'Low' },
    ];

    for (const s of samples) {
      await notificationService.createNotification(s);
    }

    res.json({ message: 'Centralized notifications seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
