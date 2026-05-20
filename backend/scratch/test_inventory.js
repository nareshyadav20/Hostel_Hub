const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Inventory = require('../src/models/Inventory');

async function test() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const count = await Inventory.countDocuments();
    console.log('Inventory count:', count);
    
    const items = await Inventory.find().limit(1);
    console.log('Sample item:', items);
    
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

test();
