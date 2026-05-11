const mongoose = require('mongoose');
const Building = require('./src/models/Building');
const User = require('./src/models/User');

async function checkDB() {
  try {
    await mongoose.connect('mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db');
    
    const buildings = await Building.find({});
    console.log(`Total buildings: ${buildings.length}`);
    
    const ownersInDB = [...new Set(buildings.map(b => b.owner ? b.owner.toString() : 'NO_OWNER'))];
    console.log(`Owners found in buildings:`, ownersInDB);
    
    for (const id of ownersInDB) {
      if (id === 'NO_OWNER') continue;
      const u = await User.findById(id);
      console.log(`ID: ${id} | User: ${u ? u.email : 'NOT FOUND'}`);
    }
    
    const systemOwner = await User.findOne({ role: 'OWNER' });
    console.log(`System Owner in DB: ${systemOwner ? systemOwner.email : 'NONE'} (${systemOwner ? systemOwner._id : 'N/A'})`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDB();
