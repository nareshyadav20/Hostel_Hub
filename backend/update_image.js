const mongoose = require('mongoose');
const Building = require('./src/models/Building');

async function update() {
  try {
    await mongoose.connect('mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db');
    const res = await Building.updateOne(
      { name: 'GGA Elite Residency' },
      { $set: { images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'] } }
    );
    console.log('Update result:', res);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

update();
