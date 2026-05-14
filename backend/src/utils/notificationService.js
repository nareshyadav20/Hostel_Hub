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

    // Real-time update via Socket.IO
    if (data.buildingId) {
      socketService.emitUpdate(data.buildingId.toString(), 'newNotification', notification);
    } else {
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
