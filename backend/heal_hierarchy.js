const mongoose = require('mongoose');
const Building = require('./src/models/Building');
const Floor = require('./src/models/Floor');
const Room = require('./src/models/Room');
const Bed = require('./src/models/Bed');

async function healHierarchy() {
  try {
    const connectionString = 'mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db';
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');

    // 1. Heal Buildings -> Floors
    console.log('Healing Buildings -> Floors...');
    const buildings = await Building.find();
    for (const building of buildings) {
      const floors = await Floor.find({ buildingId: building._id }).select('_id');
      building.floors = floors.map(f => f._id);
      await building.save();
      console.log(`Building ${building.name}: Added ${building.floors.length} floors.`);
    }

    // 2. Heal Floors -> Rooms
    console.log('\nHealing Floors -> Rooms...');
    const floors = await Floor.find();
    for (const floor of floors) {
      const rooms = await Room.find({ floor: floor._id }).select('_id');
      floor.rooms = rooms.map(r => r._id);
      await floor.save();
      console.log(`Floor ${floor.floorNumber} (in building ${floor.buildingId}): Added ${floor.rooms.length} rooms.`);
    }

    // 3. Heal Rooms -> Beds
    console.log('\nHealing Rooms -> Beds...');
    const rooms = await Room.find();
    for (const room of rooms) {
      const beds = await Bed.find({ roomId: room._id }).select('_id');
      room.beds = beds.map(b => b._id);
      await room.save();
      console.log(`Room ${room.roomNumber} (in floor ${room.floor}): Added ${room.beds.length} beds.`);
    }

    console.log('\nHeal complete!');
    process.exit(0);
  } catch (err) {
    console.error('Heal failed:', err);
    process.exit(1);
  }
}

healHierarchy();
