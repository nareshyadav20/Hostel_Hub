const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkSettings() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const buildings = await db.collection('buildings').find({}).toArray();
    const settings = await db.collection('systemsettings').find({}).toArray();
    
    console.log(`Found ${buildings.length} buildings and ${settings.length} settings records.`);
    
    for (const b of buildings) {
      const s = settings.find(x => x.buildingId === b._id.toString());
      if (!s) {
        console.warn(`WARNING: Building ${b.name} (${b._id}) has NO settings record!`);
      } else {
        console.log(`SUCCESS: Building ${b.name} has settings initialized.`);
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSettings();
