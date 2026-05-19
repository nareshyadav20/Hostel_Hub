const RewardsWallet = require('../models/RewardsWallet');
const RewardsTransaction = require('../models/RewardsTransaction');
const socketService = require('../utils/socketService');

const addPoints = async ({ userId, points, type, description, relatedUserId }) => {
  // Find or create wallet
  let wallet = await RewardsWallet.findOne({ userId });
  if (!wallet) {
    wallet = new RewardsWallet({
      userId,
      availablePoints: 0,
      lifetimeEarned: 0,
      totalRedeemed: 0
    });
  }

  const pointsToAdd = Number(points) || 0;
  
  wallet.availablePoints += pointsToAdd;
  if (pointsToAdd > 0) {
    wallet.lifetimeEarned += pointsToAdd;
  } else if (pointsToAdd < 0) {
    wallet.totalRedeemed += Math.abs(pointsToAdd);
  }
  
  await wallet.save();

  // Save transaction
  const transaction = new RewardsTransaction({
    userId,
    type,
    points: pointsToAdd,
    description,
    relatedUserId
  });
  await transaction.save();

  // Emit socket event 'rewardUpdated' to all relevant rooms
  const payload = {
    availablePoints: wallet.availablePoints,
    lifetimeEarned: wallet.lifetimeEarned,
    totalRedeemed: wallet.totalRedeemed
  };
  
  const User = require('../models/User');
  const userObj = await User.findById(userId);
  if (userObj && userObj.tenantId) {
    socketService.emitToUser(userObj.tenantId, 'tenant', 'rewardUpdated', payload);
  }
  socketService.emitToUser(userId, 'tenant', 'rewardUpdated', payload);
  socketService.emitToUser(userId, 'owner', 'rewardUpdated', payload);

  return wallet;
};

const processFirstRentRewardByTenant = async (tenantId) => {
  try {
    const User = require('../models/User');
    const referredUser = await User.findOne({ tenantId }) || await User.findById(tenantId);
    if (!referredUser) return;
    
    const Referral = require('../models/Referral');
    const referral = await Referral.findOne({ referredUserId: referredUser._id, rewardIssued: false });
    if (!referral) return;

    // Safety validation: Prevent multiple rewards and self-referrals
    if (referral.rewardIssued) return;
    if (referral.referrerId.toString() === referredUser._id.toString()) return;

    const { createNotification } = require('./notificationService');
    const referrerUser = await User.findById(referral.referrerId);

    // 1. Credit Referrer (+200 points)
    await addPoints({
      userId: referral.referrerId,
      points: 200,
      type: 'REFERRAL_RENT_PAYMENT',
      description: `Referral Reward: ${referredUser.name || 'Friend'} completed first rent payment`,
      relatedUserId: referredUser._id
    });

    // 2. Credit referred friend (+100 points)
    await addPoints({
      userId: referredUser._id,
      points: 100,
      type: 'WELCOME_BONUS',
      description: `Welcome Bonus: Completed first rent payment`,
      relatedUserId: referral.referrerId
    });

    // 3. Mark Referral Completed
    referral.status = 'COMPLETED';
    referral.rewardIssued = true;
    await referral.save();

    // 4. Create Notification for Referrer
    await createNotification({
      userId: referral.referrerId,
      title: 'Referral Reward Earned',
      message: `You earned 200 points because ${referredUser.name || 'your friend'} completed first rent payment.`,
      type: 'REFERRAL_REWARD'
    });

    // 5. Create Notification for New Friend
    await createNotification({
      userId: referredUser._id,
      title: 'Welcome Bonus Earned',
      message: `You earned 100 bonus points for completing your first rent payment.`,
      type: 'WELCOME_BONUS'
    });

    console.log(`🎉 [REFERRALS] Successfully rewarded referrer ${referrerUser?.name} and friend ${referredUser.name} for first rent payment.`);
  } catch (error) {
    console.error('⚠️ [REFERRALS] Error processing first rent reward:', error.message);
  }
};

module.exports = {
  addPoints,
  processFirstRentRewardByTenant
};
