const express = require('express');
const router = express.Router();
const controller = require('../controllers/tenantPortalController');
const auth = require('../utils/authMiddleware');
const upload = require('../utils/upload');

// Community Reports
router.post('/community-reports', auth, controller.createCommunityReport);
router.get('/community-reports', auth, controller.getCommunityReports);

// SOS Alerts
router.post('/sos-alerts', auth, controller.createSOSAlert);

// Rewards
router.get('/rewards/me', auth, controller.getMyRewards);

// Wishlist
router.post('/wishlist', auth, controller.addToWishlist);
router.get('/wishlist', auth, controller.getMyWishlist);
router.delete('/wishlist/:id', auth, controller.removeFromWishlist);

// Profile
router.get('/complete-profile', auth, controller.getCompleteProfile);
router.put('/update-profile', auth, controller.updateProfile);
router.post('/upload-profile-pic', auth, upload.single('profilePic'), controller.uploadProfilePic);

// Payments
router.post('/pay-rent', auth, controller.payRent);

module.exports = router;

