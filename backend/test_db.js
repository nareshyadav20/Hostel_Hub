require('dotenv').config();
const mongoose = require('mongoose');

async function testDB() {
  try {
    const uri = process.env.MONGO_URI || process.env.DATABASE_URL;
    console.log("Using URI:", uri);
    await mongoose.connect(uri);
    console.log("✅ MongoDB Atlas connected successfully.");
    
    const db = mongoose.connection.db;
    console.log("Database name:", db.databaseName);
    
    const collections = await db.listCollections().toArray();
    console.log("Collection names:");
    collections.forEach(c => console.log(` - ${c.name}`));
    
    // Check old Building model vs new HostelListing model
    const Building = require('./src/models/Building');
    const bCount = await Building.countDocuments();
    console.log("Building Count:", bCount);
    
    const newHostelModelPath = './src/models/hostel.model';
    try {
      const HostelListing = require(newHostelModelPath);
      const hCount = await HostelListing.countDocuments();
      console.log("HostelListing (v1 API) Count:", hCount);
      
      const hostels = await HostelListing.find().limit(5);
      console.log("First 5 HostelListings:", hostels);
    } catch (err) {
      console.log("Error loading new Hostel model:", err.message);
    }
    
    // Also check standard Hostel model if it exists
    try {
      const OldHostel = require('./src/models/Hostel');
      const ohCount = await OldHostel.countDocuments();
      console.log("Hostel (old API) Count:", ohCount);
    } catch (err) {}

    // Temporary remove filter test
    try {
      const publicBuildingsWithFilter = await Building.find({
        $or: [
          { approvalStatus: 'approved', isApproved: true },
          { status: 'Active', approvalStatus: { $in: [null, undefined] } }
        ]
      });
      console.log("Public Buildings with API filter:", publicBuildingsWithFilter.length);
      
      const publicBuildingsWithoutFilter = await Building.find({});
      console.log("Total Buildings without filter:", publicBuildingsWithoutFilter.length);
    } catch (e) {
      console.error(e);
    }

  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

testDB();
