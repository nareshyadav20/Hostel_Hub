const mongoose = require('mongoose');

const adminProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '+91 98765 43210' },
  location: { type: String, default: 'Bangalore, India' },
  bio: { type: String, default: 'Overseeing the entire Livora Hostel Hub ecosystem. Specialized in platform security and administrative intelligence.' },
  avatar: { type: String, default: '' }, // Base64 profile photo data or image path
  
  // Login credentials & login details stored inside admin_profile
  password: { type: String }, // Hashed login password
  role: { type: String, default: 'SUPER_ADMIN' }, // Login authorization role
  lastLogin: { type: Date } // Login audit timestamp
}, { timestamps: true, collection: 'admin_profile' });

module.exports = mongoose.model('AdminProfile', adminProfileSchema);
