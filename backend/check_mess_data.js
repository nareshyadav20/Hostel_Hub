const mongoose = require('mongoose');
const MessMenu = require('./src/models/MessMenu');
const MessAttendance = require('./src/models/MessAttendance');
const Building = require('./src/models/Building');
const Tenant = require('./src/models/Tenant');

async function checkMessData() {
  try {
    await mongoose.connect('mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db');
    
    console.log('--- Mess Menu Data (owner_messmenus) ---');
    const menus = await MessMenu.find({}).populate('buildingId', 'name');
    console.log(`Found ${menus.length} menu entries.`);
    
    menus.forEach(m => {
      console.log(`Plan: ${m.plan} | Day: ${m.day} | Building: ${m.buildingId ? m.buildingId.name : 'N/A'}`);
      console.log(`  Breakfast: ${m.breakfast}`);
      console.log(`  Lunch: ${m.lunch}`);
      console.log(`  Dinner: ${m.dinner}`);
    });

    console.log('\n--- Mess Attendance Data (owner_messattendance) ---');
    // Limit to 10 for brevity if there are many
    const attendance = await MessAttendance.find({}).limit(10).populate('tenantId', 'name').populate('buildingId', 'name');
    console.log(`Found ${await MessAttendance.countDocuments()} attendance records. Showing up to 10:`);
    
    attendance.forEach(a => {
      console.log(`Date: ${a.date} | Tenant: ${a.tenantId ? a.tenantId.name : 'N/A'} | Building: ${a.buildingId ? a.buildingId.name : 'N/A'}`);
      console.log(`  Meals: Breakfast(${a.breakfast}), Lunch(${a.lunch}), Dinner(${a.dinner})`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkMessData();
