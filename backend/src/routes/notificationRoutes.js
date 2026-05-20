const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../utils/authMiddleware');

router.use(authMiddleware);

router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.post('/', notificationController.createNotification);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read/:id', notificationController.markAsRead);
router.post('/mark-all-read', notificationController.markAllAsRead);
router.patch('/:id/archive', notificationController.archiveNotification);
router.delete('/:id', notificationController.deleteNotification);

router.post('/seed', notificationController.seedNotifications);
module.exports = router;
