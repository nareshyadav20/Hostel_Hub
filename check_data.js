const mongoose = require('mongoose');
const Building = require('./backend/src/models/Building');
const Floor = require('./backend/src/models/Floor');
const Room = require('./backend/src/models/Room');
const Bed = require('./backend/src/models/Bed');

async function checkData() {
  const uri = "mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db";
  await mongoose.connect(uri);
  console.log('Connected to Atlas');

  const buildings = await Building.find();
  console.log('Total Buildings:', buildings.length);
  for (const b of buildings) {
    const floors = await Floor.find({ building: b._id });
    console.log(`Building ${b.name} (${b._id}) has ${floors.length} floors`);
    for (const f of floors) {
      const rooms = await Room.find({ floor: f._id });
      console.log(`  Floor ${f.floorNumber} (${f._id}) has ${rooms.length} rooms`);
      for (const r of rooms) {
        const beds = await Bed.find({ room: r._id });
        console.log(`    Room ${r.roomNumber} (${r._id}) has ${beds.length} beds`);
      }
    }
  }
  process.exit(0);
}

checkData().catch(err => {
  console.error(err);
  process.exit(1);
});
