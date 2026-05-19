const express = require('express');
const router = express.Router();
const rewardsController = require('../controllers/rewardsController');
const authMiddleware = require('../utils/authMiddleware');

// Ensure routes are secure
router.use(authMiddleware);

router.get('/referral-link', rewardsController.getReferralLink);
router.get('/wallet', rewardsController.getRewardsWallet);
router.get('/history', rewardsController.getRewardsHistory);

module.exports = router;
