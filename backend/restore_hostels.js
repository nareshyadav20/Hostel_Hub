const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Hostel = require('./src/models/Hostel');
const Building = require('./src/models/Building');
const User = require('./src/models/User');

async function restore() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hostelhub');
    console.log('✅ Connected!');

    // Get all owners
    const owners = await User.find({ role: { $in: ['OWNER', 'owner'] } }).lean();
    console.log(`Found ${owners.length} owners in the system.`);

    for (const owner of owners) {
      console.log(`\nProcessing owner: ${owner.email} (${owner.name}, ID: ${owner._id})`);
      
      // Get all buildings for this owner
      const buildings = await Building.find({ owner: owner._id }).lean();
      console.log(`- Owner has ${buildings.length} buildings.`);

      const buildingIds = buildings.map(b => b._id);
      
      // Check if a hostel exists for this owner
      let hostel = await Hostel.findOne({ owner: owner._id });
      
      if (!hostel) {
        console.log(`- ⚠️ No Hostel document found for owner ${owner.name}. Recreating...`);
        
        // Define hostel name (e.g. from the first building, or fallback)
        const hostelName = buildings.length > 0 ? `${buildings[0].name.replace(/Skyline|Valley|PG|Stay/g, '').trim()} Hostel` : 'Royal Hostel';
        
        hostel = new Hostel({
          name: hostelName,
          address: buildings.length > 0 ? buildings[0].address : 'Main Street',
          owner: owner._id,
          buildings: buildingIds,
          totalBeds: 0,
          filledBeds: 0,
          subscription: {
            plan: 'BASIC',
            status: 'ACTIVE'
          }
        });
        
        await hostel.save();
        console.log(`- ✅ Created Hostel: "${hostel.name}" with ${buildingIds.length} buildings.`);
      } else {
        console.log(`- ✅ Hostel exists: "${hostel.name}" (ID: ${hostel._id})`);
        
        // Ensure all buildings are mapped
        let needsUpdate = false;
        buildingIds.forEach(id => {
          if (!hostel.buildings.includes(id)) {
            hostel.buildings.push(id);
            needsUpdate = true;
          }
        });
        
        if (needsUpdate) {
          await hostel.save();
          console.log(`- Updated hostel buildings mapping.`);
        } else {
          console.log(`- All buildings already correctly mapped to hostel.`);
        }
      }
    }

    console.log('\nHostels restoration completed successfully.');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error during restoration:', err);
  }
}

restore();
