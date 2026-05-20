const notificationService = require('../utils/notificationService');
const Notification = require('../models/Notification');
const OwnerNotification = require('../models/OwnerNotification');

exports.getNotifications = async (req, res) => {
  try {
    const { buildingId, portalType, moduleName, priority, isRead } = req.query;
    const filters = { archived: false };
    const mongoose = require('mongoose');
    
    const isTenant = req.user.role === 'TENANT';
    const Model = isTenant ? Notification : OwnerNotification;

    if (isTenant) {
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
      // Owner sees owner-specific notifications from OwnerNotification
      const Building = require('../models/Building');
      const ownerBuildings = await Building.find({ owner: req.user.id }, '_id').lean();
      const buildingIds = ownerBuildings.map(b => b._id);
      
      if (buildingId) {
        const bIdStr = buildingId.toString();
        const bIdObj = mongoose.Types.ObjectId.isValid(bIdStr) ? new mongoose.Types.ObjectId(bIdStr) : null;
        
        filters.$or = [
          { buildingId: bIdStr },
          { buildingId: bIdObj },
          { buildingId: null },
          { buildingId: { $exists: false } }
        ];
      } else {
        filters.$or = [
          { buildingId: { $in: buildingIds } },
          { buildingId: null },
          { buildingId: { $exists: false } }
        ];
      }
      
      if (portalType) filters.portalType = portalType;
    }
    
    // Additional filters from query
    if (portalType && req.user.role !== 'TENANT') filters.portalType = portalType;
    if (moduleName) filters.moduleName = moduleName;
    if (priority) filters.priority = priority;
    if (isRead !== undefined) filters.isRead = isRead === 'true';

    console.log('📡 [DB_FETCH] Processing request for Portal Hub...');
    console.log('📝 [DB_FETCH] FINAL_QUERY_OBJECT:', JSON.stringify(filters, null, 2));
    const notifications = await Model.find(filters).sort({ createdAt: -1 }).limit(100);
    
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
    
    const isTenant = req.user.role === 'TENANT';
    const Model = isTenant ? Notification : OwnerNotification;

    if (isTenant) {
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
      const Building = require('../models/Building');
      const ownerBuildings = await Building.find({ owner: req.user.id }, '_id').lean();
      const buildingIds = ownerBuildings.map(b => b._id);

      if (buildingId) {
        const bIdStr = buildingId.toString();
        const bIdObj = (bIdStr && mongoose.Types.ObjectId.isValid(bIdStr)) ? new mongoose.Types.ObjectId(bIdStr) : null;
        query.$or = [
          { buildingId: bIdStr },
          { buildingId: bIdObj },
          { buildingId: null },
          { buildingId: { $exists: false } }
        ];
      } else {
        query.$or = [
          { buildingId: { $in: buildingIds } },
          { buildingId: null },
          { buildingId: { $exists: false } }
        ];
      }
    }
    
    const count = await Model.countDocuments(query);
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
    const isTenant = req.user.role === 'TENANT';
    const Model = isTenant ? Notification : OwnerNotification;

    if (isTenant) {
      const { getOrCreateTenant } = require('../utils/tenantHelper');
      const tenant = await getOrCreateTenant(req.user);
      const tenantId = tenant?._id || req.user.id;
      query.$or = [{ tenantId: tenantId.toString() }, { receiverId: tenantId.toString() }, { target: 'All Tenants' }];
    } else {
      query.$or = [{ owner: req.user.id }, { portalType: 'Owner' }];
    }
    
    const notification = await Model.findOneAndUpdate(
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
    const isTenant = req.user.role === 'TENANT';
    const Model = isTenant ? Notification : OwnerNotification;
    
    if (isTenant) {
      const { getOrCreateTenant } = require('../utils/tenantHelper');
      const tenant = await getOrCreateTenant(req.user);
      const tenantId = tenant?._id || req.user.id;
      query.$or = [{ tenantId: tenantId.toString() }, { receiverId: tenantId.toString() }, { target: 'All Tenants' }];
    } else {
      query.$or = [{ owner: req.user.id }, { portalType: 'Owner' }];
    }
    
    if (category && category !== 'all') query.category = category;
    if (buildingId) query.buildingId = buildingId;
    
    await Model.updateMany(query, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.archiveNotification = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    const isTenant = req.user.role === 'TENANT';
    const Model = isTenant ? Notification : OwnerNotification;

    if (isTenant) {
      const { getOrCreateTenant } = require('../utils/tenantHelper');
      const tenant = await getOrCreateTenant(req.user);
      const tenantId = tenant?._id || req.user.id;
      query.$or = [{ tenantId: tenantId.toString() }, { receiverId: tenantId.toString() }, { target: 'All Tenants' }];
    } else {
      query.$or = [{ owner: req.user.id }, { portalType: 'Owner' }];
    }
    
    const notification = await Model.findOneAndUpdate(
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
    const isTenant = req.user.role === 'TENANT';
    const Model = isTenant ? Notification : OwnerNotification;

    if (isTenant) {
      const { getOrCreateTenant } = require('../utils/tenantHelper');
      const tenant = await getOrCreateTenant(req.user);
      const tenantId = tenant?._id || req.user.id;
      query.$or = [{ tenantId: tenantId.toString() }, { receiverId: tenantId.toString() }, { target: 'All Tenants' }];
    } else {
      query.$or = [{ owner: req.user.id }, { portalType: 'Owner' }];
    }
    
    const result = await Model.deleteOne(query);
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
