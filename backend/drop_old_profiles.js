const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dropOldCollection = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    const oldColl = 'owner_ownerprofiles';
    
    const collections = await db.listCollections({ name: oldColl }).toArray();
    if (collections.length > 0) {
      console.log(`Dropping collection: ${oldColl}...`);
      await db.collection(oldColl).drop();
      console.log('Collection removed successfully.');
    } else {
      console.log(`Collection ${oldColl} does not exist.`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Failed to drop collection:', err);
    process.exit(1);
  }
};

dropOldCollection();
