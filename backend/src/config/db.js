const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }

  const attemptConnect = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true,
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`❌ MongoDB connection failed: ${error.message}`);
      console.log('🔄 Retrying connection in 10 seconds...');
      console.log('👉 Make sure your IP is whitelisted on MongoDB Atlas: https://cloud.mongodb.com/');
      setTimeout(attemptConnect, 10000);
    }
  };

  await attemptConnect();
};

module.exports = connectDB;
