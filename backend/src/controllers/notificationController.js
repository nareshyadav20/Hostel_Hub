const notificationService = require('../utils/notificationService');
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { buildingId, portalType, moduleName, priority, isRead } = req.query;
    const filters = { archived: false };
    const mongoose = require('mongoose');
    
    if (buildingId) {
      const bIdStr = buildingId.toString();
      filters.$and = filters.$and || [];
      filters.$and.push({
        $or: [
          { buildingId: bIdStr },
          { buildingId: mongoose.Types.ObjectId.isValid(bIdStr) ? new mongoose.Types.ObjectId(bIdStr) : null },
          { buildingId: { $exists: false } },
          { buildingId: null }
        ]
      });
    }

    // Role-based targeting
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
      // Owner sees:
      // 1. Notifications explicitly for 'Owner' portal
      // 2. Notifications where they are the 'owner'
      // 3. Any notification targeting their building (Management oversight)
      filters.$or = [
        { owner: req.user.id },
        { portalType: 'Owner' },
        { buildingId: filters.buildingId }
      ];
      // If they are filtering by portalType specifically, apply it
      if (portalType) filters.portalType = portalType;
    }
    
    // Additional filters from query
    if (portalType && req.user.role !== 'TENANT') filters.portalType = portalType;
    if (moduleName) filters.moduleName = moduleName;
    if (priority) filters.priority = priority;
    if (isRead !== undefined) filters.isRead = isRead === 'true';

    console.log('🔍 FETCH_NOTIFICATIONS:', {
      userRole: req.user.role,
      userId: req.user.id,
      filters
    });

    const notifications = await Notification.find(filters).sort({ createdAt: -1 }).limit(100);
    console.log(`✅ FETCH_SUCCESS: Found ${notifications.length} notifications`);
    if (notifications.length > 0) {
      console.log('🔍 SAMPLE_NOTIF:', {
        title: notifications[0].title,
        portalType: notifications[0].portalType,
        buildingId: notifications[0].buildingId
      });
    }
    
    // Transform _id to id for frontend compatibility if needed (handleId does this in frontend but let's be safe)
    res.json(notifications);
  } catch (error) {
    console.error('❌ FETCH_ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const query = { isRead: false, archived: false };
    const mongoose = require('mongoose');
    
    if (buildingId) {
      const bIdStr = buildingId.toString();
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { buildingId: bIdStr },
          { buildingId: mongoose.Types.ObjectId.isValid(bIdStr) ? new mongoose.Types.ObjectId(bIdStr) : null },
          { buildingId: { $exists: false } },
          { buildingId: null }
        ]
      });
    }
    
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
        { portalType: 'Owner' },
        { buildingId: query.buildingId }
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

    const samples = [
      {
        moduleName: 'Mess',
        portalType: 'Owner',
        category: 'Attendance',
        title: 'Attendance Confirmation',
        message: 'Rahul (Room 204) has confirmed attendance for Dinner tonight in Livora Building.',
        priority: 'Low',
        type: 'info',
        buildingId
      },
      {
        moduleName: 'Mess',
        portalType: 'Owner',
        category: 'Attendance',
        title: 'Meal Skipped',
        message: 'Priya (Room 105) has opted to skip Breakfast tomorrow to reduce waste.',
        priority: 'Medium',
        type: 'warning',
        buildingId
      },
      {
        moduleName: 'Payments',
        portalType: 'Owner',
        category: 'Rent',
        title: 'Payment Received',
        message: 'Rent payment of ₹8,500 received from Rahul via UPI.',
        priority: 'High',
        type: 'success',
        buildingId
      },
      {
        moduleName: 'Complaints',
        portalType: 'Owner',
        category: 'Plumbing',
        title: 'New Maintenance Request',
        message: '🚨 Leaking Tap: Room 204 reported a water leak in the washroom.',
        priority: 'High',
        type: 'error',
        buildingId
      }
    ];

    for (const s of samples) {
      await notificationService.createNotification(s);
    }

    res.json({ message: 'Centralized notifications seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
