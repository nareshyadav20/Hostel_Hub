const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  console.log('✅ Connected to database:', db.databaseName);

  const collections = await db.listCollections().toArray();
  console.log('\n📦 Collections found:', collections.map(c => c.name).join(', '));

  // Count each key collection
  const checks = [
    'buildings', 'owner_buildings', 'hostels', 'floors', 'owner_floors',
    'rooms', 'owner_rooms', 'beds', 'tenants', 'users', 'bookings',
    'payments', 'complaints', 'notifications', 'wishlists', 'reviews',
    'hostellistings', 'password_resets'
  ];

  console.log('\n📊 Document Counts:');
  for (const col of checks) {
    try {
      const count = await db.collection(col).countDocuments();
      console.log(`  ${col}: ${count}`);
    } catch (e) {
      console.log(`  ${col}: ERROR - ${e.message}`);
    }
  }

  // Sample buildings/public data
  console.log('\n🏨 Sample Buildings (limit 3):');
  const buildings = await db.collection('buildings').find().limit(3).toArray();
  buildings.forEach(b => console.log(`  - ${b.name} | City: ${b.locationCity} | Price: ₹${b.startingPrice} | Gender: ${b.genderType}`));

  // Sample hostels
  console.log('\n🏠 Sample Hostels (limit 3):');
  const hostels = await db.collection('hostels').find().limit(3).toArray();
  hostels.forEach(h => console.log(`  - ${h.name} | Location: ${h.location} | Beds: ${h.totalBeds}`));

  await mongoose.disconnect();
  console.log('\n✅ Done');
}

run().catch(console.error);
