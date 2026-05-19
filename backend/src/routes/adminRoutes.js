const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../utils/authMiddleware');

// All admin routes are protected
router.use(authMiddleware);

// Owners management
router.get('/owners', adminController.getAllOwners);
router.patch('/owners/:id/status', adminController.updateOwnerStatus);

// Platform statistics
router.get('/stats', adminController.getPlatformStats);

// Admin profile management
router.get('/profile', adminController.getAdminProfile);
router.put('/profile', adminController.updateAdminProfile);

// Admin settings management
router.get('/settings', adminController.getAdminSettings);
router.put('/settings', adminController.updateAdminSettings);

// Staff management
router.get('/staff', adminController.getAllStaff);

module.exports = router;
