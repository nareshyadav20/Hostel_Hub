const Notification = require('../models/Notification');
const socketService = require('./socketService');

let io;

const setIo = (socketIo) => {
  io = socketIo;
};

/**
 * Centralized function to create notifications from any module
 */
const createNotification = async (data) => {
  try {
    const notification = new Notification({
      ...data,
      isRead: false,
    });
    
    await notification.save();
    console.log('📦 DB_SAVE_COMPLETE:', {
      _id: notification._id,
      title: notification.title,
      buildingId: notification.buildingId,
      portalType: notification.portalType
    });
    console.log('📝 Notification saved to DB:', {
      id: notification._id,
      module: notification.moduleName,
      portal: notification.portalType,
      building: notification.buildingId
    });

    // Real-time update via Socket.IO
    // 1. Target specific user if receiverId is provided
    if (data.receiverId && data.receiverRole) {
      console.log('📡 Emitting to user:', data.receiverId);
      socketService.emitToUser(data.receiverId, data.receiverRole, 'newNotification', notification);
    } 
    // 2. Target building room if buildingId is provided (broadcast to building)
    // ONLY if it's NOT an Owner-exclusive notification to prevent Tenants from seeing it
    else if (data.buildingId && data.portalType !== 'Owner') {
      socketService.emitToRoom(data.buildingId, 'newNotification', notification);
    }
    
    // 3. Fallback/Dual-emit for Owners if it's an owner notification
    if (data.portalType === 'Owner' || data.owner) {
      socketService.emitToOwner('newNotification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

/**
 * Specifically for system-triggered or critical alerts
 */
const createSystemAlert = async (buildingId, title, message, priority = 'High', type = 'warning') => {
  return await createNotification({
    moduleName: 'System',
    portalType: 'Owner',
    category: 'Alert',
    title,
    message,
    priority,
    type,
    buildingId
  });
};

const getNotifications = async (buildingId, filters = {}) => {
  try {
    const query = { buildingId, archived: false, ...filters };
    return await Notification.find(query).sort({ createdAt: -1 }).limit(50);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

const markAsRead = async (notificationId) => {
  try {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return null;
  }
};

const markAllAsRead = async (buildingId) => {
  try {
    return await Notification.updateMany({ buildingId, isRead: false }, { isRead: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return null;
  }
};

const getUnreadCount = async (buildingId) => {
  try {
    return await Notification.countDocuments({ buildingId, isRead: false, archived: false });
  } catch (error) {
    return 0;
  }
};

module.exports = {
  setIo,
  createNotification,
  createSystemAlert,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
};
