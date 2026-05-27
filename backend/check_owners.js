const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const Building = require('./src/models/Building');
const Tenant = require('./src/models/Tenant');
const User = require('./src/models/User');

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('=== USERS ===');
    const users = await User.find({}).lean();
    console.log(users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role })));

    console.log('=== BUILDINGS ===');
    const buildings = await Building.find({}).lean();
    console.log(buildings.map(b => ({ id: b._id, name: b.name, owner: b.owner })));

    console.log('=== TENANTS ===');
    const tenants = await Tenant.find({}).lean();
    console.log(`Total tenants: ${tenants.length}`);
    // Group tenants by building
    const grouped = {};
    tenants.forEach(t => {
      const bKey = t.buildingId ? t.buildingId.toString() : 'None';
      if (!grouped[bKey]) grouped[bKey] = [];
      grouped[bKey].push({ id: t._id, name: t.name, email: t.email, buildingId: t.buildingId });
    });
    console.log('Tenants by building:');
    for (const bId in grouped) {
      console.log(`Building ${bId}: ${grouped[bId].length} tenants`);
      if (grouped[bId].length > 0) {
        console.log('Sample:', grouped[bId].slice(0, 3));
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
check();
