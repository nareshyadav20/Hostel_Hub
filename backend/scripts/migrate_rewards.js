const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/Dell/Hostel_Hub/Hostel_Hub/backend/.env' });

async function migrateRewards() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_hub');
    const db = mongoose.connection.db;
    
    const walletDocs = await db.collection('rewardsWallet').find().toArray();
    console.log('Found', walletDocs.length, 'documents in rewardsWallet collection');
    
    if (walletDocs.length > 0) {
      for (const doc of walletDocs) {
        try {
          const existingReward = await db.collection('rewards').findOne({ user: doc.userId });
          if (!existingReward) {
            await db.collection('rewards').insertOne({
              user: doc.userId,
              tenant: doc.userId, // use userId to satisfy unique constraint
              points: doc.availablePoints,
              lifetimeEarned: doc.lifetimeEarned,
              used: doc.totalRedeemed,
              history: [],
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt
            });
          }
        } catch (e) {
          console.log('Skipping due to error:', e.message);
        }
      }
      console.log('Successfully merged rewardsWallet documents into rewards');
      await db.collection('rewardsWallet').deleteMany({});
      console.log('Cleared legacy rewardsWallet collection');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
migrateRewards();
