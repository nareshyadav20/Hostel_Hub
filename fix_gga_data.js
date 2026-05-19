const mongoose = require('mongoose');
const Building = require('./backend/src/models/Building');
const Floor = require('./backend/src/models/Floor');

async function fixData() {
  const uri = "mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db";
  await mongoose.connect(uri);
  console.log('Connected to Atlas');

  const ggaBuildingId = "69fd9dd472de2376611f749d";
  const building = await Building.findById(ggaBuildingId);
  
  if (!building) {
    console.log("GGA Elite Residency Building not found.");
    process.exit(1);
  }

  console.log(`Checking Building: ${building.name} (${building._id})`);
  console.log(`Floors registered in building: ${building.floors.length}`);

  for (const fId of building.floors) {
    const floor = await Floor.findById(fId);
    if (floor) {
      console.log(`Floor ${floor.floorNumber} (${floor._id}) currently points to Building: ${floor.building || 'NULL'}`);
      if (!floor.building || floor.building.toString() !== ggaBuildingId) {
        console.log(`  -> FIXING: Updating Floor ${floor._id} to point to Building ${ggaBuildingId}`);
        floor.building = ggaBuildingId;
        await floor.save();
      }
    } else {
      console.log(`Floor ID ${fId} found in building.floors but document missing in owner_floors collection!`);
    }
  }

  console.log("Sync complete.");
  process.exit(0);
}

fixData().catch(err => {
  console.error(err);
  process.exit(1);
});
