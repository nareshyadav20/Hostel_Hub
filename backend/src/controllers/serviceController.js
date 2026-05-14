const Laundry = require('../models/Laundry');
const RoomCleaning = require('../models/tenant/RoomCleaning');
const Visitor = require('../models/tenant/Visitor');
const Leave = require('../models/tenant/Leave');
const Complaint = require('../models/Complaint');
const { getOrCreateTenant } = require('../utils/tenantHelper');
const socketService = require('../utils/socketService');
const notificationService = require('../utils/notificationService');

// Helper to get tenant profile
const getTenantProfile = async (userData) => {
  return await getOrCreateTenant(userData);
};

// Laundry Handlers
exports.createLaundryOrder = async (req, res) => {
  try {
    const { items, pickupDate } = req.body;
    const tenant = await getTenantProfile(req.user);
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    console.log('👕 Creating Laundry Order for:', tenant.email);
    const laundry = await Laundry.create({
      orderNumber,
      items,
      pickupDate,
      tenant: tenant._id,
      user: req.user.id
    });

    // Also create a Complaint record for Service Hub
    await Complaint.create({
      title: `Laundry Order #${orderNumber}`,
      description: `Pickup for ${items.map(i => `${i.count}x ${i.name}`).join(', ')}`,
      category: 'Laundry',
      priority: 'Medium',
      tenant: tenant._id,
      user: req.user.id,
      buildingId: tenant.buildingId?._id || tenant.buildingId
    });

    // Real-time update for owner
    if (tenant.buildingId) {
      socketService.emitUpdate(tenant.buildingId.toString(), 'complaintCreated', {
        complaint: { title: `Laundry Order #${orderNumber}`, category: 'Laundry' },
        tenantName: tenant.name
      });
    }

    // Notifications
    await notificationService.createNotification({
      portalType: 'Tenant',
      moduleName: 'Laundry',
      category: 'Services',
      title: 'Laundry Order Placed',
      message: `Your laundry order #${orderNumber} has been placed successfully.`,
      priority: 'Low',
      buildingId: tenant.buildingId,
      tenantId: tenant._id,
      actionLink: '/services'
    });

    await notificationService.createNotification({
      portalType: 'Owner',
      moduleName: 'Laundry',
      category: 'Services',
      title: 'New Laundry Order',
      message: `Tenant ${tenant.name} placed laundry order #${orderNumber}`,
      priority: 'Low',
      buildingId: tenant.buildingId,
      actionLink: '/services'
    });

    console.log('✅ Laundry Order Saved:', laundry._id);
    res.status(201).json(laundry);
  } catch (error) {
    console.error('❌ Laundry Error:', error);
    res.status(500).json({ message: 'Failed to create laundry order', error: error.message });
  }
};

exports.getMyLaundryOrders = async (req, res) => {
  try {
    const orders = await Laundry.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch laundry orders', error: error.message });
  }
};

// Cleaning Handlers
exports.scheduleCleaning = async (req, res) => {
  try {
    const { date, slot } = req.body;
    const tenant = await getTenantProfile(req.user);
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    console.log('🧹 Scheduling Cleaning for:', tenant.email);
    const cleaning = await RoomCleaning.create({
      date,
      slot,
      tenant: tenant._id,
      user: req.user.id
    });

    // Also create a Complaint record for Service Hub
    await Complaint.create({
      title: `Room Cleaning Request`,
      description: `Scheduled for ${new Date(date).toLocaleDateString()} at slot: ${slot}`,
      category: 'Cleaning',
      priority: 'Low',
      tenant: tenant._id,
      user: req.user.id,
      buildingId: tenant.buildingId?._id || tenant.buildingId
    });

    // Real-time update for owner
    if (tenant.buildingId) {
      socketService.emitUpdate(tenant.buildingId.toString(), 'complaintCreated', {
        complaint: { title: `Room Cleaning Request`, category: 'Cleaning' },
        tenantName: tenant.name
      });
    }

    // Notifications
    await notificationService.createNotification({
      portalType: 'Tenant',
      moduleName: 'Cleaning',
      category: 'Services',
      title: 'Cleaning Scheduled',
      message: `Room cleaning scheduled for ${new Date(date).toLocaleDateString()} at ${slot}.`,
      priority: 'Low',
      buildingId: tenant.buildingId,
      tenantId: tenant._id,
      actionLink: '/services'
    });

    await notificationService.createNotification({
      portalType: 'Owner',
      moduleName: 'Cleaning',
      category: 'Services',
      title: 'Cleaning Request',
      message: `Tenant ${tenant.name} requested room cleaning.`,
      priority: 'Low',
      buildingId: tenant.buildingId,
      actionLink: '/services'
    });

    console.log('✅ Cleaning Scheduled:', cleaning._id);
    res.status(201).json(cleaning);
  } catch (error) {
    console.error('❌ Cleaning Error:', error);
    res.status(500).json({ message: 'Failed to schedule cleaning', error: error.message });
  }
};

exports.getMyCleaningHistory = async (req, res) => {
  try {
    const history = await RoomCleaning.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cleaning history', error: error.message });
  }
};

// Visitor Handlers
exports.createVisitorAccess = async (req, res) => {
  try {
    const { name, relation, arrivalDate } = req.body;
    const tenant = await getTenantProfile(req.user);
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    console.log('🎫 Creating Visitor Access for:', tenant.email);
    const visitor = await Visitor.create({
      name,
      relation,
      arrivalDate,
      tenant: tenant._id,
      user: req.user.id
    });

    // Also create a Complaint record for Service Hub
    await Complaint.create({
      title: `Visitor Pass: ${name}`,
      description: `Relationship: ${relation}. Expected arrival: ${new Date(arrivalDate).toLocaleString()}`,
      category: 'Visitor',
      priority: 'Medium',
      tenant: tenant._id,
      user: req.user.id,
      buildingId: tenant.buildingId?._id || tenant.buildingId
    });

    // Real-time update for owner
    if (tenant.buildingId) {
      socketService.emitUpdate(tenant.buildingId.toString(), 'complaintCreated', {
        complaint: { title: `Visitor Pass: ${name}`, category: 'Visitor' },
        tenantName: tenant.name
      });
    }

    // Notifications
    await notificationService.createNotification({
      portalType: 'Tenant',
      moduleName: 'Visitor',
      category: 'Security',
      title: 'Visitor Pass Created',
      message: `Pass created for ${name}. Expected arrival: ${new Date(arrivalDate).toLocaleDateString()}`,
      priority: 'Medium',
      buildingId: tenant.buildingId,
      tenantId: tenant._id,
      actionLink: '/services'
    });

    await notificationService.createNotification({
      portalType: 'Owner',
      moduleName: 'Visitor',
      category: 'Security',
      title: 'New Visitor Pass',
      message: `Tenant ${tenant.name} created a pass for ${name}.`,
      priority: 'Medium',
      buildingId: tenant.buildingId,
      actionLink: '/services'
    });

    console.log('✅ Visitor Access Saved:', visitor._id);
    res.status(201).json(visitor);
  } catch (error) {
    console.error('❌ Visitor Error:', error);
    res.status(500).json({ message: 'Failed to create visitor access', error: error.message });
  }
};

exports.getMyVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch visitor history', error: error.message });
  }
};

// Leave Handlers
exports.submitLeaveNotice = async (req, res) => {
  try {
    const { fromDate, toDate, reason } = req.body;
    const tenant = await getTenantProfile(req.user);
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    console.log('📝 Submitting Leave Notice for:', tenant.email);
    const leave = await Leave.create({
      fromDate,
      toDate,
      reason,
      tenant: tenant._id,
      user: req.user.id
    });

    // Also create a Complaint record for Service Hub
    await Complaint.create({
      title: `Leave Notice`,
      description: `From ${new Date(fromDate).toLocaleDateString()} to ${new Date(toDate).toLocaleDateString()}. Reason: ${reason}`,
      category: 'Leave',
      priority: 'Medium',
      tenant: tenant._id,
      user: req.user.id,
      buildingId: tenant.buildingId?._id || tenant.buildingId
    });

    // Real-time update for owner
    if (tenant.buildingId) {
      socketService.emitUpdate(tenant.buildingId.toString(), 'complaintCreated', {
        complaint: { title: `Leave Notice`, category: 'Leave' },
        tenantName: tenant.name
      });
    }

    // Notifications
    await notificationService.createNotification({
      portalType: 'Tenant',
      moduleName: 'Leave',
      category: 'Services',
      title: 'Leave Notice Submitted',
      message: `Your leave notice from ${new Date(fromDate).toLocaleDateString()} has been recorded.`,
      priority: 'Medium',
      buildingId: tenant.buildingId,
      tenantId: tenant._id,
      actionLink: '/services'
    });

    await notificationService.createNotification({
      portalType: 'Owner',
      moduleName: 'Leave',
      category: 'Services',
      title: 'New Leave Notice',
      message: `Tenant ${tenant.name} submitted a leave notice.`,
      priority: 'Medium',
      buildingId: tenant.buildingId,
      actionLink: '/services'
    });

    console.log('✅ Leave Saved:', leave._id);
    res.status(201).json(leave);
  } catch (error) {
    console.error('❌ Leave Submit Error:', error);
    res.status(500).json({ message: 'Failed to submit leave notice', error: error.message });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leave history', error: error.message });
  }
};
