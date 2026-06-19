const mongoose = require('mongoose');
require('dotenv').config();

async function migrateData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_hub');
    const db = mongoose.connection.db;

    const collections = [
      { from: 'buildings', to: 'owner_buildings' },
      { from: 'floors', to: 'owner_floors' },
      { from: 'rooms', to: 'owner_rooms' },
      { from: 'beds', to: 'owner_beds' }
    ];

    for (let col of collections) {
      const from = col.from;
      const to = col.to;
      const fromExists = await db.listCollections({ name: from }).hasNext();
      if (!fromExists) continue;

      const docs = await db.collection(from).find().toArray();
      if (docs.length > 0) {
        for (let doc of docs) {
          const id = doc._id;
          delete doc._id;
          await db.collection(to).updateOne(
            { _id: id },
            { $set: doc },
            { upsert: true }
          );
        }
        console.log('Migrated ' + docs.length + ' docs from ' + from + ' to ' + to);
      }
      
      await db.collection(from).drop();
      console.log('Dropped legacy collection ' + from);
    }

    if (await db.listCollections({ name: 'hostels' }).hasNext()) {
      await db.collection('hostels').drop();
      console.log('Dropped legacy collection hostels');
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrateData();
