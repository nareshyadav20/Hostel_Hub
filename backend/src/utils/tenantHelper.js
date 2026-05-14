const Tenant = require('../models/Tenant');
const User = require('../models/User');

const getOrCreateTenant = async (userData) => {
  let tenant = await Tenant.findOne({ email: userData.email });
  
  if (!tenant) {
    // If tenant doesn't exist, try to find the user to get their details
    const user = await User.findById(userData.id);
    if (!user) return null;

    tenant = await Tenant.create({
      name: user.name,
      email: user.email,
      phone: user.phone || '0000000000',
      status: 'ACTIVE',
      user: user._id
    });
  }
  
  return tenant;
};

module.exports = { getOrCreateTenant };
