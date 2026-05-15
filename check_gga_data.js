const mongoose = require('mongoose');
const Building = require('./backend/src/models/Building');
const Floor = require('./backend/src/models/Floor');
const Room = require('./backend/src/models/Room');
const Bed = require('./backend/src/models/Bed');

async function checkData() {
  const uri = "mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db";
  await mongoose.connect(uri);
  console.log('Connected to Atlas');

  const ggaBuildingId = "69fd9dd472de2376611f749d";
  const building = await Building.findById(ggaBuildingId);
  
  if (!building) {
    console.log("GGA Elite Residency Building not found by ID.");
    process.exit(1);
  }

  console.log(`Building: ${building.name} (${building._id})`);
  console.log(`Building.floors array: ${JSON.stringify(building.floors)}`);

  const floors = await Floor.find({ building: building._id });
  console.log(`Floors pointing to this building: ${floors.length}`);

  for (const f of floors) {
    console.log(`  Floor: ${f.floorNumber} (${f._id})`);
    const rooms = await Room.find({ floor: f._id });
    console.log(`    Rooms on this floor: ${rooms.length}`);
    for (const r of rooms) {
      console.log(`      Room: ${r.roomNumber} (${r._id})`);
      const beds = await Bed.find({ room: r._id });
      console.log(`        Beds in this room: ${beds.length}`);
    }
  }

  // Also check if there are floors that should belong to GGA but have a different building ID
  const allFloors = await Floor.find();
  console.log("\nSearching for potentially mislinked floors...");
  for (const f of allFloors) {
    if (f.building && f.building.toString() !== building._id.toString()) {
       // Just listing a few to see if there's a pattern
       if (f.building.toString().startsWith("69fd9dd")) {
           console.log(`Floor ${f.floorNumber} (${f._id}) points to Building ${f.building}`);
       }
    }
  }

  process.exit(0);
}

checkData().catch(err => {
  console.error(err);
  process.exit(1);
});
