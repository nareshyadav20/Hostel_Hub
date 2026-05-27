const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const Hostel = require('./src/models/Hostel');
const Building = require('./src/models/Building');

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const hostels = await Hostel.find({}).lean();
    console.log('--- ALL HOSTELS ---');
    console.log(hostels.map(h => ({ id: h._id, name: h.name, owner: h.owner, buildings: h.buildings })));

    const buildings = await Building.find({}).lean();
    console.log('--- ALL BUILDINGS ---');
    console.log(buildings.map(b => ({ id: b._id, name: b.name, owner: b.owner })));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
check();
