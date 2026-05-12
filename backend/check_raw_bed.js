const mongoose = require('mongoose');
const Bed = require('./src/models/Bed');

async function checkRawBeds() {
  try {
    const connectionString = 'mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db';
    await mongoose.connect(connectionString);
    
    const bed = await Bed.findOne();
    console.log('Raw Bed Data:', JSON.stringify(bed, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkRawBeds();
