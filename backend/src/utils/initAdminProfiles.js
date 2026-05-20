const User = require('../models/User');
const AdminProfile = require('../models/AdminProfile');

const initAdminProfiles = async () => {
  try {
    console.log('Initializing admin profiles in backend...');
    
    // Find all administrative users (SUPER_ADMIN only)
    const users = await User.find({ role: 'SUPER_ADMIN' });
    console.log(`Found ${users.length} SUPER_ADMIN users in owner_users.`);
    
    for (const user of users) {
      const existingProfile = await AdminProfile.findOne({ userId: user._id });
      if (!existingProfile) {
        console.log(`Creating default admin profile document for ${user.email} in admin_profile collection...`);
        await AdminProfile.create({
          userId: user._id,
          name: user.name || 'Super Admin',
          email: user.email,
          phone: user.phone || '+91 98765 43210',
          location: 'Bangalore, India',
          bio: 'Overseeing the entire Livora Hostel Hub ecosystem. Specialized in platform security and administrative intelligence.',
          avatar: '', // Starts empty, can be updated via upload later
          password: user.password,
          role: user.role,
          lastLogin: new Date()
        });
        console.log(`Successfully stored profile details and login credentials for ${user.email} in admin_profile collection!`);
      } else {
        // Sync credentials and login details to the admin_profile collection if missing
        let hasChanges = false;
        if (!existingProfile.password || existingProfile.password !== user.password) {
          existingProfile.password = user.password;
          hasChanges = true;
        }
        if (!existingProfile.role || existingProfile.role !== user.role) {
          existingProfile.role = user.role;
          hasChanges = true;
        }
        if (!existingProfile.lastLogin) {
          existingProfile.lastLogin = new Date();
          hasChanges = true;
        }
        if (hasChanges) {
          await existingProfile.save();
          console.log(`Synced credentials and login details for ${user.email} in admin_profile collection.`);
        } else {
          console.log(`Profile and credentials for ${user.email} already exists and is fully synced.`);
        }
      }
    }
  } catch (err) {
    console.error('Failed to initialize admin profiles:', err);
  }
};

module.exports = initAdminProfiles;
