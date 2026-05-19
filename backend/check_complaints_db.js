const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const mongoURI = process.env.MONGO_URI || process.env.DATABASE_URL;

async function checkCollections() {
  try {
    console.log("Connecting to:", mongoURI);
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB!");

    const db = mongoose.connection.db;

    const complaintsCount = await db.collection('complaints').countDocuments();
    const ownerComplaintsCount = await db.collection('owner_complaints').countDocuments();

    console.log(`Document count in 'complaints' collection: ${complaintsCount}`);
    console.log(`Document count in 'owner_complaints' collection: ${ownerComplaintsCount}`);

    console.log("\n--- Sample from 'complaints' ---");
    const sampleComplaints = await db.collection('complaints').find({}).limit(2).toArray();
    console.log(JSON.stringify(sampleComplaints, null, 2));

    console.log("\n--- Sample from 'owner_complaints' ---");
    const sampleOwnerComplaints = await db.collection('owner_complaints').find({}).limit(2).toArray();
    console.log(JSON.stringify(sampleOwnerComplaints, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("Error checking collections:", err);
    process.exit(1);
  }
}

checkCollections();
