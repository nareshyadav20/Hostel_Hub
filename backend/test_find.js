const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const list = await mongoose.connection.db.collection('complaints').find({}).toArray();
  list.forEach((c, idx) => {
    console.log(`${idx}: id=${c._id}, title=${c.title || c.issue}, date=${c.date}, createdAt=${c.createdAt}`);
  });
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
