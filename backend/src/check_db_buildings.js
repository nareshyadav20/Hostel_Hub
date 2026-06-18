const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function inspect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    const bDoc = await db.collection('buildings').findOne({});
    console.log('=== BUILDINGS DOCUMENT SAMPLE ===');
    console.log(JSON.stringify(bDoc, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
inspect();
