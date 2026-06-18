const mongoose = require('mongoose');
const Building = require('./src/models/Building');
const dotenv = require('dotenv');

dotenv.config();

const deleteAllHostels = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_hub');
    console.log('Connected to MongoDB.');

    const result = await Building.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} hostels from the database.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

deleteAllHostels();
