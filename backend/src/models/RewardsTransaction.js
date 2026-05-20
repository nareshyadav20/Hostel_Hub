const mongoose = require('mongoose');

const rewardsTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  points: { type: Number, required: true },
  description: { type: String, required: true },
  relatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true, collection: 'rewardsTransactions' });

module.exports = mongoose.model('RewardsTransaction', rewardsTransactionSchema);
