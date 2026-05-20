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
router.get('/analytics', adminController.getPlatformAnalytics);

// Admin profile management
router.get('/profile', adminController.getAdminProfile);
router.put('/profile', adminController.updateAdminProfile);

// Admin settings management
router.get('/settings', adminController.getAdminSettings);
router.put('/settings', adminController.updateAdminSettings);

// Staff management
router.get('/staff', adminController.getAllStaff);

// User KYC / Documents management
router.get('/users/kyc', adminController.getPlatformUsersKyc);
router.patch('/users/kyc/:id/status', adminController.updateUserKycStatus);

// CMS management
router.get('/cms', adminController.getAdminCms);
router.put('/cms', adminController.updateAdminCms);

// Insights management
router.get('/insights', adminController.getAdminInsights);
router.put('/insights', adminController.updateAdminInsights);

// Support management
router.get('/support', adminController.getAdminSupport);
router.put('/support', adminController.updateAdminSupport);
router.post('/support/escalate', adminController.escalateSupportTicket);
router.post('/support/chat', adminController.sendSupportChatMessage);

module.exports = router;
