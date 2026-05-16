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
      // 3. Any notification targeting buildings they own
      
      const Building = require('../models/Building');
      const ownerBuildings = await Building.find({ owner: req.user.id }, '_id').lean();
      const buildingIds = ownerBuildings.map(b => b._id);
      
      const ownerIdStr = req.user.id.toString();
      const ownerIdObj = mongoose.Types.ObjectId.isValid(ownerIdStr) ? new mongoose.Types.ObjectId(ownerIdStr) : null;

      // START WITH A BROAD SCOPE FOR OWNERS
      filters.$or = [
        { portalType: 'Owner' },
        { owner: ownerIdStr },
        { buildingId: { $in: buildingIds } }
      ];
      if (ownerIdObj) filters.$or.push({ owner: ownerIdObj });

      // If a specific buildingId was requested, we MUST respect it but keep portalType: 'Owner' alerts visible
      if (buildingId) {
        const bIdStr = buildingId.toString();
        const bIdObj = mongoose.Types.ObjectId.isValid(bIdStr) ? new mongoose.Types.ObjectId(bIdStr) : null;
        
        filters.$or = [
          { portalType: 'Owner' }, // Always allow general owner alerts
          { buildingId: bIdStr }
        ];
        if (bIdObj) filters.$or.push({ buildingId: bIdObj });
      }
      
      // If they are filtering by portalType specifically, apply it as a top-level constraint
      if (portalType) filters.portalType = portalType;
    }
    
    // Additional filters from query
    if (portalType && req.user.role !== 'TENANT') filters.portalType = portalType;
    if (moduleName) filters.moduleName = moduleName;
    if (priority) filters.priority = priority;
    if (isRead !== undefined) filters.isRead = isRead === 'true';

    console.log('📡 [DB_FETCH] Processing request for Owner Hub...');
    const notifications = await Notification.find(filters).sort({ createdAt: -1 }).limit(100);
    
    console.log(`✅ [DB_FETCH] Query successful. Found ${notifications.length} persistent records.`);
    if (notifications.length > 0) {
      console.log('📊 [DB_FETCH] TOP_RECORD_DIAGNOSTICS:', {
        title: notifications[0].title,
        module: notifications[0].moduleName,
        portal: notifications[0].portalType,
        building: notifications[0].buildingId,
        id: notifications[0]._id,
        timestamp: notifications[0].createdAt
      });
    } else {
      console.warn('⚠️ [DB_FETCH] Warning: No persistent notifications found for this query.');
    }
    
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
      const bIdStr = buildingId ? buildingId.toString() : null;
      const bIdObj = (bIdStr && mongoose.Types.ObjectId.isValid(bIdStr)) ? new mongoose.Types.ObjectId(bIdStr) : null;

      query.$or = [
        { owner: req.user.id },
        { portalType: 'Owner' },
        { buildingId: bIdStr },
        { buildingId: bIdObj }
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
