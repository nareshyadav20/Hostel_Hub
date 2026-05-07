const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const migrateTenants = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    console.log('Fetching Tenant accounts from "owner_users"...');
    const tenantUsers = await db.collection('owner_users').find({ role: 'TENANT' }).toArray();
    console.log(`Found ${tenantUsers.length} tenant accounts.`);

    if (tenantUsers.length === 0) {
      console.log('No tenant accounts found to migrate.');
      process.exit(0);
    }

    console.log('Copying documents to "users" collection...');
    
    // We use insertMany or loop to ensure we don't crash on duplicates if run twice
    let insertedCount = 0;
    for (const user of tenantUsers) {
      const exists = await db.collection('users').findOne({ email: user.email });
      if (!exists) {
        await db.collection('users').insertOne(user);
        insertedCount++;
      }
    }

    console.log(`\nMigration Complete!`);
    console.log(` - Total tenants found: ${tenantUsers.length}`);
    console.log(` - New documents added to "users": ${insertedCount}`);

    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrateTenants();
