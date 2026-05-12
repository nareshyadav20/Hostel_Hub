const mongoose = require('mongoose');

async function listCollections() {
  try {
    const connectionString = 'mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db';
    await mongoose.connect(connectionString);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(collections.map(c => c.name));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listCollections();
