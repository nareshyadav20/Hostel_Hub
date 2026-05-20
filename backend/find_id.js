const mongoose = require('mongoose');

async function findId() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db");
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  const idToFind = new mongoose.Types.ObjectId("6a03121fbd8b2af1d3c56b38");
  
  for (let c of collections) {
    const col = db.collection(c.name);
    const doc = await col.findOne({ _id: idToFind });
    if (doc) {
      console.log(`Found in collection: ${c.name}`);
      console.log(doc);
      process.exit(0);
    }
  }
  console.log("Not found anywhere.");
  process.exit(0);
}

findId().catch(console.error);
