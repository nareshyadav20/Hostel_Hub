const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const AdminProfile = require('./src/models/AdminProfile');

dotenv.config();

const runCheck = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const profiles = await AdminProfile.find({});
    console.log(`Found ${profiles.length} profile(s) in admin_profile:`);
    
    for (const p of profiles) {
      const user = await User.findById(p.userId);
      console.log('----------------------------------------------------');
      console.log('Profile ID:', p._id);
      console.log('User ID:', p.userId);
      console.log('User Role:', user ? user.role : 'NOT FOUND');
      console.log('Name:', p.name);
      console.log('Email:', p.email);
      console.log('Avatar Length:', p.avatar ? p.avatar.length : 0);
      if (p.avatar) {
        console.log('Avatar Preview:', p.avatar.slice(0, 50) + '...');
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Check failed:', err);
    process.exit(1);
  }
};

runCheck();
