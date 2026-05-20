const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");
  const count = await mongoose.connection.collection('tenants').countDocuments();
  console.log("Tenants in DB:", count);
  const Tenant = require('./src/models/Tenant');
  const tCount = await Tenant.countDocuments();
  console.log("Tenants using Mongoose Model:", tCount);
  process.exit(0);
}
run().catch(console.error);
