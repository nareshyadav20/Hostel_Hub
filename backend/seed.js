const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Building = require('./src/models/Building');
const Floor = require('./src/models/Floor');
const Room = require('./src/models/Room');
const Bed = require('./src/models/Bed');

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing (Commented out to prevent data loss on every run)
    // await Building.deleteMany({});
    // await Floor.deleteMany({});
    // await Room.deleteMany({});
    // await Bed.deleteMany({});
    
    console.log('Seeding initial data...');
    
    // Alpha Tower
    const b1 = await Building.create({ 
      name: 'Alpha Tower', 
      address: 'Silicon Valley', 
      images: ['/assets/building.jpg'] 
    });
    
    const f1 = await Floor.create({ floorNumber: 'G', building: b1._id, images: ['/assets/floor.png'] });
    const f2 = await Floor.create({ floorNumber: '1', building: b1._id, images: ['/assets/floor.png'] });
    
    await Building.findByIdAndUpdate(b1._id, { $push: { floors: { $each: [f1._id, f2._id] } } });
    
    const r1 = await Room.create({ roomNumber: '101', roomType: 'Single', capacity: 1, floor: f1._id, images: ['/assets/room.png'] });
    const r2 = await Room.create({ roomNumber: '102', roomType: 'Shared', capacity: 2, floor: f1._id, images: ['/assets/room.png'] });
    const r3 = await Room.create({ roomNumber: '201', roomType: 'Dormitory', capacity: 4, floor: f2._id, images: ['/assets/room.png'] });
    
    await Floor.findByIdAndUpdate(f1._id, { $push: { rooms: { $each: [r1._id, r2._id] } } });
    await Floor.findByIdAndUpdate(f2._id, { $push: { rooms: r3._id } });
    
    const beds = [
      { bedNumber: '101A', status: 'OCCUPIED', room: r1._id, images: ['/assets/bed.jpg'] },
      { bedNumber: '102A', status: 'OCCUPIED', room: r2._id, images: ['/assets/bed.jpg'] },
      { bedNumber: '102B', status: 'AVAILABLE', room: r2._id, images: ['/assets/bed.jpg'] },
      { bedNumber: '201A', status: 'OCCUPIED', room: r3._id, images: ['/assets/bed.jpg'] },
      { bedNumber: '201B', status: 'AVAILABLE', room: r3._id, images: ['/assets/bed.jpg'] },
      { bedNumber: '201C', status: 'AVAILABLE', room: r3._id, images: ['/assets/bed.jpg'] },
      { bedNumber: '201D', status: 'AVAILABLE', room: r3._id, images: ['/assets/bed.jpg'] },
    ];
    
    const createdBeds = await Bed.insertMany(beds);
    
    await Room.findByIdAndUpdate(r1._id, { $push: { beds: createdBeds[0]._id } });
    await Room.findByIdAndUpdate(r2._id, { $push: { beds: { $each: [createdBeds[1]._id, createdBeds[2]._id] } } });
    await Room.findByIdAndUpdate(r3._id, { $push: { beds: { $each: [createdBeds[3]._id, createdBeds[4]._id, createdBeds[5]._id, createdBeds[6]._id] } } });

    // Beta Block
    const b2 = await Building.create({ 
      name: 'Beta Block', 
      address: 'Tech Park', 
      images: ['/assets/building.jpg'] 
    });
    
    const f3 = await Floor.create({ floorNumber: '1', building: b2._id, images: ['/assets/floor.png'] });
    await Building.findByIdAndUpdate(b2._id, { $push: { floors: f3._id } });
    
    const r4 = await Room.create({ roomNumber: '101', roomType: 'Single', capacity: 1, floor: f3._id, images: ['/assets/room.png'] });
    await Floor.findByIdAndUpdate(f3._id, { $push: { rooms: r4._id } });
    
    const bed8 = await Bed.create({ bedNumber: '101A', status: 'AVAILABLE', room: r4._id, images: ['/assets/bed.jpg'] });
    await Room.findByIdAndUpdate(r4._id, { $push: { beds: bed8._id } });
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
