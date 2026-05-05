const express = require('express');
const router = express.Router();
const controller = require('../controllers/tenantPortalController');
const auth = require('../utils/authMiddleware');

// Community Reports
router.post('/community-reports', auth, controller.createCommunityReport);
router.get('/community-reports', auth, controller.getCommunityReports);

// Rewards
router.get('/rewards/me', auth, controller.getMyRewards);

// Wishlist
router.post('/wishlist', auth, controller.addToWishlist);
router.get('/wishlist', auth, controller.getMyWishlist);
router.delete('/wishlist/:id', auth, controller.removeFromWishlist);

module.exports = router;
