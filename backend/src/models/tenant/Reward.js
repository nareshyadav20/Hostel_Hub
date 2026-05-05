const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, default: 0 },
  lifetimeEarned: { type: Number, default: 0 },
  used: { type: Number, default: 0 },
  history: [{
    reason: String,
    points: Number,
    type: { type: String, enum: ['Earned', 'Redeemed'] },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
