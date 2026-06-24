const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function clearHostels() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    const Building = require('./src/models/Building');
    const Floor = require('./src/models/Floor');
    const Room = require('./src/models/Room');
    const Bed = require('./src/models/Bed');

    console.log('Deleting all buildings, floors, rooms, and beds...');
    
    const buildingResult = await Building.deleteMany({});
    console.log(`Deleted ${buildingResult.deletedCount} buildings.`);

    const floorResult = await Floor.deleteMany({});
    console.log(`Deleted ${floorResult.deletedCount} floors.`);

    const roomResult = await Room.deleteMany({});
    console.log(`Deleted ${roomResult.deletedCount} rooms.`);

    const bedResult = await Bed.deleteMany({});
    console.log(`Deleted ${bedResult.deletedCount} beds.`);

    console.log('Successfully cleared all hostel data.');
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

clearHostels();
