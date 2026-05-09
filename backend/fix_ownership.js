const mongoose = require('mongoose');
const Building = require('./src/models/Building');
const User = require('./src/models/User');

async function fixOwnership() {
  try {
    await mongoose.connect('mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db');
    
    const owner = await User.findOne({ role: 'OWNER' });
    if (!owner) {
      console.error("No OWNER found in DB!");
      process.exit(1);
    }
    
    console.log(`Fixing ownership to: ${owner.name} (${owner._id})`);
    
    const result = await Building.updateMany(
      { owner: "69fcbdb9c2b6a1b41c39625d" },
      { $set: { owner: owner._id } }
    );
    
    console.log(`Updated ${result.modifiedCount} buildings.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixOwnership();
