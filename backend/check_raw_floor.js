const mongoose = require('mongoose');
const Floor = require('./src/models/Floor');

async function checkRawFloors() {
  try {
    const connectionString = 'mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db';
    await mongoose.connect(connectionString);
    
    const floor = await Floor.findOne();
    console.log('Raw Floor Data:', JSON.stringify(floor, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkRawFloors();
