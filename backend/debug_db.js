const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

// Register models
require('./src/models/Building');
require('./src/models/Tenant');
require('./src/models/Booking');
require('./src/models/User');

const Tenant = mongoose.model('Tenant');
const Booking = mongoose.model('Booking');
const User = mongoose.model('User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const tenants = await Tenant.find().populate('buildingId');
    console.log('--- TENANTS ---');
    tenants.forEach(t => {
      console.log(`Name: ${t.name}, Email: ${t.email}, Building: ${t.buildingId?.name || 'None'}, ID: ${t._id}`);
    });

    const bookings = await Booking.find().populate('buildingId');
    console.log('\n--- BOOKINGS ---');
    bookings.forEach(b => {
      console.log(`TenantID: ${b.tenantId}, Building: ${b.buildingId?.name || 'None'}, Status: ${b.status}, ID: ${b._id}`);
    });

    const users = await User.find();
    console.log('\n--- USERS ---');
    users.forEach(u => {
      console.log(`Name: ${u.name}, Email: ${u.email}, ID: ${u._id}`);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();
