const mongoose = require('mongoose');
const Building = require('./src/models/Building');
const dotenv = require('dotenv');
dotenv.config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const buildings = await Building.find({});
    console.log(`Total buildings in DB: ${buildings.length}`);
    
    const owners = [...new Set(buildings.map(b => b.owner?.toString()))];
    console.log('Building Owners in DB:', owners);
    
    buildings.forEach(b => {
      console.log(`Building: ${b.name}, Owner: ${b.owner}, Status: ${b.status}`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkData();
