require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const numRooms = await db.collection('rooms').countDocuments();
  console.log('Total rooms in DB:', numRooms);
  
  const b = await db.collection('buildings').findOne({ name: 'royal residency' });
  console.log('royal residency floors array:', b.floors);
  
  if (b.floors && b.floors.length > 0) {
     const f = await db.collection('floors').findOne({ _id: b.floors[0] });
     console.log('Floor 0 rooms array:', f.rooms);
     const roomsForFloor = await db.collection('rooms').find({ floor: f._id }).toArray();
     console.log('Rooms in Room collection with this floor ID:', roomsForFloor.length);
  }
  
  process.exit(0);
});
