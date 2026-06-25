const mongoose = require('mongoose');
const fs = require('fs');

const uri = "mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db";

async function dumpDatabase() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const dump = {};

    for (let collection of collections) {
      console.log(`Dumping collection: ${collection.name}`);
      const data = await db.collection(collection.name).find({}).toArray();
      dump[collection.name] = data;
    }

    fs.writeFileSync('database_dump.json', JSON.stringify(dump, null, 2));
    console.log('Successfully dumped all data to database_dump.json');
    
  } catch (error) {
    console.error('Error dumping database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

dumpDatabase();
