const mongoose = require('mongoose');
const Tenant = require('./src/models/Tenant');
const Bed = require('./src/models/Bed');

async function syncBeds() {
  try {
    await mongoose.connect('mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db');
    
    console.log('--- Starting Sync ---');
    const tenants = await Tenant.find({ bedId: { $exists: true, $ne: null } });
    console.log(`Found ${tenants.length} tenants with bed assignments.`);
    
    let updatedCount = 0;
    for (const t of tenants) {
      if (t.bedId) {
        const bed = await Bed.findById(t.bedId);
        if (bed) {
          bed.tenant = t._id;
          bed.status = 'OCCUPIED';
          await bed.save();
          updatedCount++;
          console.log(`Updated Bed ${bed.bedNumber} with Tenant ${t.name}`);
        }
      }
    }

    console.log(`Successfully updated ${updatedCount} beds.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

syncBeds();
