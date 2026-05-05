const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../utils/authMiddleware');

// Laundry
router.post('/laundry', authMiddleware, serviceController.createLaundryOrder);
router.get('/laundry/me', authMiddleware, serviceController.getMyLaundryOrders);

// Cleaning
router.post('/cleaning', authMiddleware, serviceController.scheduleCleaning);
router.get('/cleaning/me', authMiddleware, serviceController.getMyCleaningHistory);

// Visitors
router.post('/visitors', authMiddleware, serviceController.createVisitorAccess);
router.get('/visitors/me', authMiddleware, serviceController.getMyVisitors);

// Leaves
router.post('/leaves', authMiddleware, serviceController.submitLeaveNotice);
router.get('/leaves/me', authMiddleware, serviceController.getMyLeaves);

module.exports = router;
