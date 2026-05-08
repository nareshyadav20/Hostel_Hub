const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const SystemSettingsSchema = new mongoose.Schema({
  buildingId: { type: String, required: true },
  rentSettings: { type: Object, default: {} },
  notificationSettings: { type: Object, default: {} },
  hygieneSettings: { type: Object, default: {} },
  roomConfig: { type: Object, default: {} },
  reportSettings: { type: Object, default: {} },
  generalSettings: { type: Object, default: {} },
  roleAccess: { type: Object, default: {} },
  themeSettings: { type: Object, default: {} }
}, { collection: 'systemsettings' });

const SystemSettings = mongoose.model('SystemSettings', SystemSettingsSchema);

async function healSettings() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const buildings = await db.collection('buildings').find({}).toArray();
    
    console.log(`Analyzing ${buildings.length} buildings...`);
    
    let createdCount = 0;
    for (const b of buildings) {
      const exists = await SystemSettings.findOne({ buildingId: b._id.toString() });
      if (!exists) {
        await SystemSettings.create({
          buildingId: b._id.toString(),
          generalSettings: { hostelName: b.name, ownerName: 'Property Owner' },
          rentSettings: { 
            defaultRent: { single: 8000, double: 6000, shared: 4500 },
            allowedPaymentMethods: ['UPI', 'Cash']
          },
          roomConfig: {
            roomTypes: ['Single', 'Shared', 'Dormitory'],
            bedTypes: ['Normal', 'Bunk']
          }
        });
        console.log(`HEALED: Created settings for ${b.name}`);
        createdCount++;
      }
    }
    
    console.log(`Database Healing Complete! Created ${createdCount} missing settings records.`);
    process.exit(0);
  } catch (err) {
    console.error('Healing Failed:', err);
    process.exit(1);
  }
}

healSettings();
