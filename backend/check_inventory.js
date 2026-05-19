const mongoose = require('mongoose');
require('dotenv').config();
const Inventory = require('./src/models/Inventory');
const Building = require('./src/models/Building');

async function checkInventory() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hostel_hub');
    const inventoryItems = await Inventory.find().distinct('buildingId');
    const buildings = await Building.find({ _id: { $in: inventoryItems } }).select('name');
    console.log('--- INVENTORY REPORT ---');
    if (buildings.length === 0) {
      console.log('No buildings found with inventory items.');
    } else {
      console.log('Buildings with inventory items:');
      buildings.forEach(b => console.log(`- ${b.name} (${b._id})`));
    }
    
    const itemsWithoutBuilding = await Inventory.countDocuments({ buildingId: null });
    if (itemsWithoutBuilding > 0) {
      console.log(`- Warning: Found ${itemsWithoutBuilding} items without a buildingId.`);
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkInventory();
