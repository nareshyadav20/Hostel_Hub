const express = require('express');
const router = express.Router();
const rewardsController = require('../controllers/rewardsController');
const authMiddleware = require('../utils/authMiddleware');

// Ensure routes are secure
router.use(authMiddleware);

router.get('/referral-link', rewardsController.getReferralLink);
router.get('/wallet', rewardsController.getRewardsWallet);
router.get('/history', rewardsController.getRewardsHistory);

// Spec-compliant: GET /api/rewards/me → wallet balance + transaction history
router.get('/me', async (req, res) => {
  try {
    const RewardsWallet = require('../models/RewardsWallet');
    const RewardsTransaction = require('../models/RewardsTransaction');
    const userId = req.user.id || req.user._id;

    let wallet = await RewardsWallet.findOne({ userId });
    if (!wallet) {
      wallet = new RewardsWallet({ userId, availablePoints: 100, lifetimeEarned: 100, totalRedeemed: 0 });
      await wallet.save();
    }
    const history = await RewardsTransaction.find({ userId }).sort({ createdAt: -1 });

    res.json({
      availablePoints: wallet.availablePoints,
      lifetimeEarned: wallet.lifetimeEarned,
      totalRedeemed: wallet.totalRedeemed,
      history
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
