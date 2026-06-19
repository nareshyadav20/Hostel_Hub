const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/Dell/Hostel_Hub/Hostel_Hub/backend/.env' });

async function migrateStaff() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_hub');
    const db = mongoose.connection.db;
    
    const staffDocs = await db.collection('staff').find().toArray();
    console.log('Found', staffDocs.length, 'documents in staff collection');
    
    if (staffDocs.length > 0) {
      for (const doc of staffDocs) {
        await db.collection('owner_staff').updateOne(
          { _id: doc._id },
          { $set: doc },
          { upsert: true }
        );
      }
      console.log('Successfully migrated staff documents to owner_staff');
      await db.collection('staff').deleteMany({});
      console.log('Cleared legacy staff collection');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
migrateStaff();
