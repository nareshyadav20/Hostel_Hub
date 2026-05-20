const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    console.log('=== owner_floors ===');
    const f = await db.collection('owner_floors').find({}).toArray();
    console.log(f);
    
    console.log('=== owner_rooms ===');
    const r = await db.collection('owner_rooms').find({}).toArray();
    console.log(r);
    
    console.log('=== owner_beds ===');
    const b = await db.collection('owner_beds').find({}).toArray();
    console.log(b);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
check();
