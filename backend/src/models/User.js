const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'OWNER', 'STAFF', 'TENANT'], 
    default: 'TENANT' 
  },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  referralCode: { type: String, unique: true, sparse: true }
}, { timestamps: true, collection: 'users' });

// Hash password before saving & generate unique referralCode
userSchema.pre('save', async function(next) {
  if (!this.referralCode) {
    const crypto = require('crypto');
    this.referralCode = crypto.randomBytes(12).toString('hex');
  }
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
