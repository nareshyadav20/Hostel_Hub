const mongoose = require('mongoose');
const Room = require('./src/models/Room');
const Bed = require('./src/models/Bed');
const Building = require('./src/models/Building');
const Floor = require('./src/models/Floor');

async function checkRoomsAndBeds() {
  try {
    // Connection string from check_db.js
    const connectionString = 'mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db';
    
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');

    const totalBuildings = await Building.countDocuments();
    const totalFloors = await Floor.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalBeds = await Bed.countDocuments();

    console.log('\n--- Database Stats ---');
    console.log(`Total Buildings: ${totalBuildings}`);
    console.log(`Total Floors:    ${totalFloors}`);
    console.log(`Total Rooms:     ${totalRooms}`);
    console.log(`Total Beds:      ${totalBeds}`);

    if (totalRooms > 0) {
      console.log('\n--- Sample Rooms (First 5) ---');
      const sampleRooms = await Room.find().limit(5).populate('floor');
      sampleRooms.forEach(room => {
        console.log(`Room: ${room.roomNumber} | Type: ${room.roomType} | Floor Num: ${room.floor ? room.floor.floorNumber : 'N/A'}`);
      });
    }

    if (totalBeds > 0) {
      console.log('\n--- Sample Beds (First 5) ---');
      const sampleBeds = await Bed.find().limit(5).populate('roomId');
      sampleBeds.forEach(bed => {
        console.log(`Bed: ${bed.bedNumber} | Status: ${bed.status} | Room Num: ${bed.roomId ? bed.roomId.roomNumber : 'N/A'}`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error('Error checking rooms and beds:', err);
    process.exit(1);
  }
}

checkRoomsAndBeds();
