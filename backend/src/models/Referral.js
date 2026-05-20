const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referralCode: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
  rewardIssued: { type: Boolean, default: false }
}, { timestamps: true, collection: 'referrals' });

module.exports = mongoose.model('Referral', referralSchema);
