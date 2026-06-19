const mongoose = require('mongoose');
require('dotenv').config();
const Building = require('./src/models/Building');
const Floor = require('./src/models/Floor');
const Room = require('./src/models/Room');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    const buildingCount = await Building.countDocuments();
    console.log("Building Count:", buildingCount);
    
    const floorCount = await Floor.countDocuments();
    console.log("Floor Count:", floorCount);
    
    const roomCount = await Room.countDocuments();
    console.log("Room Count:", roomCount);

    // Calculate Amenity count from Building collection (unique values)
    const buildingsWithAmenities = await Building.find({}, { amenities: 1 }).lean();
    const amenitySet = new Set();
    buildingsWithAmenities.forEach(b => {
      if (Array.isArray(b.amenities)) {
        b.amenities.forEach(a => { if (a) amenitySet.add(a.trim()); });
      }
    });
    console.log("Amenity Count:", amenitySet.size);

    console.log('\n--- Building Samples ---');
    console.log(JSON.stringify(await Building.find().limit(5), null, 2));

    console.log('\n--- Floor Samples ---');
    console.log(JSON.stringify(await Floor.find().limit(5), null, 2));

    console.log('\n--- Room Samples ---');
    console.log(JSON.stringify(await Room.find().limit(5), null, 2));

    console.log('\n--- Amenity Samples ---');
    console.log(JSON.stringify(Array.from(amenitySet).slice(0, 5), null, 2));

  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.disconnect();
  }
}

checkData();
