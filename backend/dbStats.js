const mongoose = require('mongoose');

const uri = "mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db";

async function getDatabaseStats() {
  try {
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const stats = [];

    for (let collection of collections) {
      const name = collection.name;
      const count = await db.collection(name).countDocuments();
      
      let sampleKeys = [];
      if (count > 0) {
        const sampleDoc = await db.collection(name).findOne({});
        if (sampleDoc) {
          sampleKeys = Object.keys(sampleDoc).filter(k => k !== '_id' && k !== '__v');
        }
      }
      
      stats.push({
        Collection: name,
        Count: count,
        Fields: sampleKeys.slice(0, 10).join(', ') + (sampleKeys.length > 10 ? '...' : '')
      });
    }

    console.table(stats);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

getDatabaseStats();
