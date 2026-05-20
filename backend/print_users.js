const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const User = require('./src/models/User');

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}).lean();
    console.log(users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role })));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
check();
