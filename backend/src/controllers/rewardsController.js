const { generateReferralLink, generateReferralMessage } = require('../utils/referralUtils');
const RewardsWallet = require('../models/RewardsWallet');
const RewardsTransaction = require('../models/RewardsTransaction');

exports.getReferralLink = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    // Ensure user has a referral code generated
    let referralCode = user.referralCode;
    if (!referralCode) {
      const User = require('../models/User');
      const crypto = require('crypto');
      const generatedCode = crypto.randomBytes(12).toString('hex');
      const dbUser = await User.findByIdAndUpdate(user.id || user._id, { referralCode: generatedCode }, { new: true });
      referralCode = dbUser.referralCode;
      user.referralCode = referralCode; // Cache it on the user object
    }

    const referralLink = generateReferralLink(user);
    const referralMessage = generateReferralMessage(user);

    res.json({
      referralCode,
      referralLink,
      referralMessage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRewardsWallet = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    let wallet = await RewardsWallet.findOne({ userId });
    if (!wallet) {
      wallet = new RewardsWallet({
        userId,
        availablePoints: 100, // Legacy default starting points
        lifetimeEarned: 100,
        totalRedeemed: 0
      });
      await wallet.save();
    }

    res.json({
      availablePoints: wallet.availablePoints,
      lifetimeEarned: wallet.lifetimeEarned,
      totalRedeemed: wallet.totalRedeemed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRewardsHistory = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const history = await RewardsTransaction.find({ userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
