const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  buildings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Building' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Owner', ownerSchema);
