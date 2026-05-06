const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Building = require('./src/models/Building');
const Tenant = require('./src/models/Tenant');
const Payment = require('./src/models/Payment');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const buildings = await Building.find();
    console.log(`Found ${buildings.length} buildings:`);
    for (const b of buildings) {
      const tenantCount = await Tenant.countDocuments({ buildingId: b._id });
      const paymentCount = await Payment.countDocuments({ buildingId: b._id });
      console.log(`- ${b.name} (${b._id}): status=${b.status}, owner=${b.owner}, tenants=${tenantCount}, payments=${paymentCount}`);
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
