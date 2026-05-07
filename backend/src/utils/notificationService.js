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
    const notification = new Notification({
      ...data,
      isRead: false,
    });
    
    await notification.save();

    // Real-time update via Socket.IO
    if (io) {
      // Emit to the specific building's room or globally to all owners
      io.to(data.buildingId).emit('newNotification', notification);
      io.emit('notificationUpdate', { type: 'NEW', notification });
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
