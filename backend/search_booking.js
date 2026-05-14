const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

require('./src/models/Building');
require('./src/models/Tenant');
require('./src/models/Booking');
require('./src/models/User');

const Booking = mongoose.model('Booking');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const booking = await Booking.findOne({ _id: { $regex: /C032A555/i } });
    console.log('--- BOOKING SEARCH ---');
    if (booking) {
      console.log(JSON.stringify(booking, null, 2));
    } else {
      console.log('No booking found matching C032A555');
      // Search all bookings for anything similar
      const all = await Booking.find().limit(10);
      console.log('First 10 bookings:', all.map(a => a._id));
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();
