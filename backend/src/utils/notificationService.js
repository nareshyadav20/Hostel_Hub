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
  console.log('⚡ [DB_PERSISTENCE] Starting notification creation for:', data.title);
  try {
    if (!data.moduleName || !data.portalType || !data.title || !data.message) {
      console.warn('❌ [DB_PERSISTENCE] Missing required fields in payload:', data);
    }

    // Ensure buildingId is a valid ObjectId if possible
    let finalData = { ...data };
    const mongoose = require('mongoose');
    if (data.buildingId && mongoose.Types.ObjectId.isValid(data.buildingId)) {
      finalData.buildingId = new mongoose.Types.ObjectId(data.buildingId);
    }

    const notification = new Notification({
      ...finalData,
      isRead: false,
    });
    
    console.log('📝 [DB_PERSISTENCE] Attempting to save to MongoDB Atlas...');
    await notification.save();
    
    console.log('✅ [DB_PERSISTENCE] SUCCESS! Notification persisted physically in DB.');
    console.log('📎 [DB_PERSISTENCE] Document Details:', {
      id: notification._id,
      module: notification.moduleName,
      portal: notification.portalType,
      category: notification.category,
      buildingId: notification.buildingId,
      createdAt: notification.createdAt
    });

    // Real-time update via Socket.IO (Happens AFTER successful DB save)
    if (data.receiverId && data.receiverRole) {
      socketService.emitToUser(data.receiverId, data.receiverRole, 'newNotification', notification);
    } 
    else if (data.buildingId && data.portalType !== 'Owner') {
      socketService.emitToRoom(data.buildingId, 'newNotification', notification);
    }
    
    if (data.portalType === 'Owner' || data.owner) {
      socketService.emitToOwner('newNotification', notification);
    }

    return notification;
  } catch (error) {
    console.error('🔥 [DB_PERSISTENCE] CRITICAL SAVE FAILURE:', {
      error: error.message,
      stack: error.stack,
      attemptedData: data
    });
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
