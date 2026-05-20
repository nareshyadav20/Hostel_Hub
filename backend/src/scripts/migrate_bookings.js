const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hostel_hub';

const runMigration = async () => {
  try {
    console.log('🔄 Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB successfully.');

    const db = mongoose.connection.db;

    // Check if the old bookings collection exists and has documents
    const collections = await db.listCollections().toArray();
    const oldCollectionExists = collections.some(col => col.name === 'bookings');

    if (!oldCollectionExists) {
      console.log('ℹ️ Old "bookings" collection does not exist in the database. Nothing to migrate.');
      process.exit(0);
    }

    const oldCollection = db.collection('bookings');
    const newCollection = db.collection('admin_bookings');

    const totalOldBookings = await oldCollection.countDocuments();
    console.log(`📦 Found ${totalOldBookings} documents in old "bookings" collection.`);

    if (totalOldBookings === 0) {
      console.log('ℹ️ Old "bookings" collection is empty. Migration complete.');
      process.exit(0);
    }

    // Retrieve all old bookings
    const bookings = await oldCollection.find({}).toArray();

    // Insert into the new collection (if they don't already exist to avoid duplicate key errors)
    let migratedCount = 0;
    for (const booking of bookings) {
      const alreadyExists = await newCollection.findOne({ _id: booking._id });
      if (!alreadyExists) {
        await newCollection.insertOne(booking);
        migratedCount++;
      }
    }

    console.log(`🎉 Successfully migrated ${migratedCount} / ${totalOldBookings} bookings to "admin_bookings" collection.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed with error:', error);
    process.exit(1);
  }
};

runMigration();
