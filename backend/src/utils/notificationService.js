const Notification = require('../models/Notification');

let io;

const setIo = (socketIo) => {
  io = socketIo;
};

/**
 * Centralized function to create notifications from any module
 */
const createNotification = async (data) => {
  try {
    const notificationData = { ...data, isRead: false };

    // Auto-prefix actionLink for Owners if it's a relative path
    if (data.portalType === 'Owner' && data.actionLink && !data.actionLink.startsWith('/owner/')) {
      const bId = data.buildingId?._id || data.buildingId;
      if (bId) {
        notificationData.actionLink = `/owner/building/${bId}${data.actionLink}`;
      }
    }

    // Duplicate Prevention for Automated Tasks
    if (data.automatedId) {
      const existing = await Notification.findOne({ automatedId: data.automatedId });
      if (existing) return existing;
    }

    const notification = new Notification(notificationData);
    
    await notification.save();

    // Real-time update via Socket.IO
    if (io) {
      // Emit to specific tenant if targeted (Most specific)
      if (data.tenantId) {
        io.to(`tenant_${data.tenantId.toString()}`).emit('newNotification', notification);
      } 
      // Otherwise emit to the building's room (General broadcast)
      else if (data.buildingId) {
        io.to(data.buildingId.toString()).emit('newNotification', notification);
      }
      
      // If it's for all portals or specific ones, emit accordingly
      if (data.portalType === 'All') {
        io.emit('notificationUpdate', { type: 'NEW', notification });
      }
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

const getNotifications = async (buildingId, filters = {}) => {
  try {
    const query = { buildingId, archived: false, ...filters };
    return await Notification.find(query).sort({ createdAt: -1 });
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
  getNotifications,
  markAsRead,
  getUnreadCount
};
