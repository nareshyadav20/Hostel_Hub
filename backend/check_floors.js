const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const floors = await db.collection('owner_floors').find().limit(2).toArray();
  console.log("Floors:", JSON.stringify(floors, null, 2));
  mongoose.disconnect();
}
check();
