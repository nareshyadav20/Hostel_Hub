const mongoose = require('mongoose');
const Tenant = require('./src/models/Tenant');
const Bed = require('./src/models/Bed');

async function checkTenantsBeds() {
  try {
    await mongoose.connect('mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db');
    
    console.log('--- Tenants with assigned Bed IDs ---');
    const tenants = await Tenant.find({ bedId: { $exists: true, $ne: null } }).populate('bedId');
    console.log(`Found ${tenants.length} tenants with bed assignments.`);
    
    tenants.forEach(t => {
      console.log(`Tenant: ${t.name} (${t.email}) | Bed: ${t.bedId ? t.bedId.bedNumber : 'MISSING REFERENCE'} (ID: ${t.bedId ? t.bedId._id : 'N/A'})`);
    });

    console.log('\n--- Beds with assigned Tenant IDs ---');
    const beds = await Bed.find({ tenant: { $exists: true, $ne: null } }).populate('tenant');
    console.log(`Found ${beds.length} beds with tenant assignments.`);
    
    beds.forEach(b => {
      console.log(`Bed: ${b.bedNumber} (ID: ${b._id}) | Tenant: ${b.tenant ? b.tenant.name : 'MISSING REFERENCE'} (ID: ${b.tenant ? b.tenant._id : 'N/A'})`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkTenantsBeds();
