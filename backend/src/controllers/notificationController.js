const notificationService = require('../utils/notificationService');
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { buildingId, portalType, moduleName, priority, isRead } = req.query;
    const filters = {};
    if (portalType) filters.portalType = portalType;
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
    const count = await notificationService.getUnreadCount(buildingId);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const { buildingId } = req.body;
    await Notification.updateMany(
      { buildingId, isRead: false }, 
      { isRead: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.archiveNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id, 
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
    await Notification.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.seedNotifications = async (req, res) => {
  try {
    const { buildingId } = req.body;
    if (!buildingId) return res.status(400).json({ message: 'buildingId is required' });

    const samples = [
      { buildingId, portalType: 'Tenant', moduleName: 'Payments', category: 'Rent', title: 'Rent Received', message: 'Tenant Rahul paid ₹8,500 via UPI.', priority: 'Medium' },
      { buildingId, portalType: 'Tenant', moduleName: 'Complaints', category: 'Maintenance', title: 'Leaking Tap', message: 'Room 204 reported a water leak in the washroom.', priority: 'High' },
      { buildingId, portalType: 'Staff', moduleName: 'Hygiene', category: 'Inspection', title: 'Cleaning Missed', message: 'Floor 2 cleaning was not logged today.', priority: 'Medium' },
      { buildingId, portalType: 'Owner', moduleName: 'Inventory', category: 'Procurement', title: 'Low Stock', message: 'Rice stock is below 10kg. Please reorder.', priority: 'High' },
      { buildingId, portalType: 'Owner', moduleName: 'Security', category: 'Alert', title: 'Late Entry', message: '3 tenants entered after 11:00 PM.', priority: 'Low' },
    ];

    for (const s of samples) {
      await notificationService.createNotification(s);
    }

    res.json({ message: 'Centralized notifications seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
