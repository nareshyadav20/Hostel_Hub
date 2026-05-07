const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.post('/', notificationController.createNotification);
router.patch('/:id/read', notificationController.markAsRead);
router.post('/mark-all-read', notificationController.markAllAsRead);
router.patch('/:id/archive', notificationController.archiveNotification);
router.delete('/:id', notificationController.deleteNotification);

router.post('/seed', notificationController.seedNotifications);

module.exports = router;
