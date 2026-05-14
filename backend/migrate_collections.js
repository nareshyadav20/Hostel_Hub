const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/hostelhub';

const collectionsToMerge = [
  { from: 'owner_beds', to: 'beds' },
  { from: 'owner_buildings', to: 'buildings' },
  { from: 'owner_complaints', to: 'complaints' },
  { from: 'owner_floors', to: 'floors' },
  { from: 'owner_hostels', to: 'hostels' },
  { from: 'owner_hostelfloormappings', to: 'hostelfloormappings' },
  { from: 'owner_inventory', to: 'inventory' },
  { from: 'owner_laundrys', to: 'laundry' },
  { from: 'owner_messattendance', to: 'messattendances' },
  { from: 'owner_messmenus', to: 'messmenus' },
  { from: 'owner_notifications', to: 'notifications' },
  { from: 'owner_payments', to: 'payments' },
  { from: 'owner_properties', to: 'properties' },
  { from: 'owner_rooms', to: 'rooms' },
  { from: 'owner_roomtransfers', to: 'roomtransfers' },
  { from: 'owner_staff', to: 'staff' },
  { from: 'owner_systemsettings', to: 'systemsettings' },
  { from: 'owner_tenants', to: 'tenants' },
  { from: 'owner_users', to: 'users' },
];

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');
    const db = mongoose.connection.db;

    for (const coll of collectionsToMerge) {
      const fromColl = db.collection(coll.from);
      const toColl = db.collection(coll.to);

      const docs = await fromColl.find({}).toArray();
      if (docs.length > 0) {
        console.log(`Migrating ${docs.length} docs from ${coll.from} to ${coll.to}...`);
        
        for (const doc of docs) {
          // Check if it already exists by _id
          const exists = await toColl.findOne({ _id: doc._id });
          if (!exists) {
            try {
              await toColl.insertOne(doc);
            } catch (insertErr) {
              if (insertErr.code !== 11000) {
                console.error(`Error inserting doc ${doc._id} into ${coll.to}:`, insertErr);
              }
            }
          }
        }
      }
    }
    console.log('Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
