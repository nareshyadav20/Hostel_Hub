const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('--- ALL COLLECTIONS AND DOCUMENT COUNTS ---');
    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`Collection: "${coll.name}" - Documents: ${count}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
check();
