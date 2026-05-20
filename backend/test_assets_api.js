const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

async function run() {
  try {
    dotenv.config();
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hostelhub');
    const User = require('./src/models/User');
    const user = await User.findOne({ role: { $in: ['Owner', 'OWNER'] } });
    if (!user) return console.log('No owner found');
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    
    console.log('Sending request to /api/assets/summary');
    const res = await axios.get('http://localhost:5000/api/assets/summary?buildingId=undefined', {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('SUCCESS:', res.data);
  } catch (err) {
    if (err.response) {
      console.log('API ERROR:', err.response.data);
    } else {
      console.log('AXIOS ERROR:', err.message);
    }
  }
  process.exit(0);
}
run();
