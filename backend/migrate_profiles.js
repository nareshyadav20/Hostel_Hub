const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const migrateProfiles = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    const sourceColl = 'owner_ownerprofiles';
    const targetColl = 'ownerprofiles';

    console.log(`Checking source collection: ${sourceColl}...`);
    const profiles = await db.collection(sourceColl).find().toArray();
    console.log(`Found ${profiles.length} profiles.`);

    if (profiles.length === 0) {
      console.log('No profiles found to migrate.');
      process.exit(0);
    }

    console.log(`Migrating to ${targetColl}...`);
    
    for (const profile of profiles) {
      const exists = await db.collection(targetColl).findOne({ userId: profile.userId });
      if (!exists) {
        await db.collection(targetColl).insertOne(profile);
      } else {
        await db.collection(targetColl).replaceOne({ userId: profile.userId }, profile);
      }
    }

    console.log('\nMigration Complete!');
    console.log(` - Documents processed: ${profiles.length}`);
    console.log(` - Collection updated: ${targetColl}`);

    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrateProfiles();
