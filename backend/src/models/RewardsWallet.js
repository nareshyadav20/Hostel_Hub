const mongoose = require('mongoose');

const rewardsWalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  availablePoints: { type: Number, default: 0 },
  lifetimeEarned: { type: Number, default: 0 },
  totalRedeemed: { type: Number, default: 0 }
}, { timestamps: true, collection: 'rewards' });

module.exports = mongoose.model('RewardsWallet', rewardsWalletSchema);
