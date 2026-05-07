const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const checkCollections = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    const collections = await db.listCollections().toArray();
    console.log('Available Collections:');
    collections.forEach(c => console.log(` - ${c.name}`));

    const usersCount = await db.collection('users').countDocuments().catch(() => 0);
    const ownerUsersCount = await db.collection('owner_users').countDocuments().catch(() => 0);

    console.log(`\nDocument counts:`);
    console.log(` - users: ${usersCount}`);
    console.log(` - owner_users: ${ownerUsersCount}`);

    if (usersCount > 0 && ownerUsersCount === 0) {
      console.log('\nWARNING: Data found in "users" but "owner_users" is empty. Application is currently pointing to "owner_users".');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkCollections();
