const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const building = await db.collection('owner_buildings').findOne();
  console.log("Building _id type:", typeof building._id, building._id.constructor.name);
  console.log("Building _id:", building._id);
  mongoose.disconnect();
}
check();
