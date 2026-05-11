const mongoose = require('mongoose');
const Building = require('./src/models/Building');
const dotenv = require('dotenv');
dotenv.config();

async function fixOwnership() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const targetOwnerId = '69f9974e393c3bc254a00ba1';
    
    // Update all buildings to belong to the current System Owner
    const result = await Building.updateMany({}, { owner: targetOwnerId });
    console.log(`Updated ${result.modifiedCount} buildings to owner: ${targetOwnerId}`);

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

fixOwnership();
