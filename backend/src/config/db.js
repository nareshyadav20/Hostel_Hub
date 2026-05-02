const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is undefined. Current directory:', process.cwd());
    console.error('🛠️ Attempted to load .env from:', path.resolve(__dirname, '../../.env'));
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
