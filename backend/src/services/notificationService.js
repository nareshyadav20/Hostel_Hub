const Notification = require('../models/Notification');
const socketService = require('../utils/socketService');

const createNotification = async ({ userId, title, message, type }) => {
  const notification = new Notification({
    userId,
    receiverId: userId ? userId.toString() : undefined,
    receiverRole: 'Tenant',
    portalType: 'Tenant',
    title,
    message,
    type: type || 'info',
    isRead: false
  });

  await notification.save();

  // Emit 'newNotification' event to the user's room (tenant and plain room)
  const User = require('../models/User');
  const userObj = await User.findById(userId);
  if (userObj && userObj.tenantId) {
    socketService.emitToUser(userObj.tenantId, 'tenant', 'newNotification', notification);
  }
  socketService.emitToUser(userId, 'tenant', 'newNotification', notification);

  return notification;
};

module.exports = {
  createNotification
};
