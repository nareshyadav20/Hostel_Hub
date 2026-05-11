const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');
dotenv.config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({});
    users.forEach(u => {
      console.log(`User: ${u.name}, ID: ${u._id}, Email: ${u.email}, Role: ${u.role}`);
    });
    await mongoose.disconnect();
  } catch (err) { console.error(err); }
}

checkUsers();
