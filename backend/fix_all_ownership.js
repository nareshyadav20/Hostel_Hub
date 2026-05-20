const mongoose = require('mongoose');
const Building = require('./src/models/Building');
const User = require('./src/models/User');

async function fixAllOwnership() {
  try {
    await mongoose.connect('mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db');
    
    const owner = await User.findOne({ role: 'OWNER' });
    if (!owner) {
      console.error("No OWNER found in DB!");
      process.exit(1);
    }
    
    console.log(`Reassigning ALL buildings to: ${owner.name} (${owner._id})`);
    
    const result = await Building.updateMany(
      {},
      { $set: { owner: owner._id } }
    );
    console.log(`Successfully reassigned ${result.modifiedCount} buildings.`);

    const Complaint = require('./src/models/Complaint');
    const complaints = await Complaint.find({});
    let updatedComplaintsCount = 0;
    for (const c of complaints) {
      if (c.buildingId) {
        const b = await Building.findById(c.buildingId);
        if (b && b.owner) {
          c.ownerId = b.owner;
          await c.save();
          updatedComplaintsCount++;
        }
      }
    }
    console.log(`Successfully synced ownerId for ${updatedComplaintsCount} complaints.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixAllOwnership();
