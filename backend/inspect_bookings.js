const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

require('./src/models/Building');
require('./src/models/Tenant');
require('./src/models/Booking');
require('./src/models/User');

const Booking = mongoose.model('Booking');
const Tenant = mongoose.model('Tenant');
const User = mongoose.model('User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- ALL BOOKINGS ---');
    const bookings = await Booking.find().populate('buildingId');
    for (const b of bookings) {
      const tenant = await Tenant.findById(b.tenantId);
      const user = await User.findById(b.tenantId);
      console.log(`ID: ${b._id}, TenantID: ${b.tenantId}, Building: ${b.buildingId?.name}, Status: ${b.status}`);
      console.log(`   Linked to Tenant: ${tenant ? tenant.name : 'NO'}, Linked to User: ${user ? user.name : 'NO'}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();
