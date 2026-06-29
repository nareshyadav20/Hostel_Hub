// Quick script to check and reset bed 101-B status
const mongoose = require('mongoose');
require('dotenv').config();

async function resetBed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const Bed = require('./src/models/Bed');
  
  // Find bed 101-B
  const bed = await Bed.findOne({ bedNumber: '101-B' });
  if (bed) {
    console.log('Found Bed 101-B:');
    console.log('  ID:', bed._id);
    console.log('  Current Status:', bed.status);
    console.log('  Tenant:', bed.tenant);
    
    // Reset it to AVAILABLE
    bed.status = 'AVAILABLE';
    bed.tenant = null;
    await bed.save();
    console.log('✅ Bed 101-B reset to AVAILABLE');
  } else {
    console.log('❌ Bed 101-B not found. Listing all beds...');
    const allBeds = await Bed.find({}).select('bedNumber status').limit(20);
    allBeds.forEach(b => console.log(`  ${b.bedNumber} → ${b.status}`));
  }

  await mongoose.disconnect();
}

resetBed().catch(console.error);
