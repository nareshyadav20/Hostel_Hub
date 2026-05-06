const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Building = require('./models/Building');
const Floor = require('./models/Floor');
const Room = require('./models/Room');
const Bed = require('./models/Bed');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_hub');
    console.log('Connected to MongoDB for seeding...');

    // 1. Clear existing data
    await Promise.all([
      User.deleteMany({ email: 'owner@hostelhub.com' }),
      Building.deleteMany({}),
      Floor.deleteMany({}),
      Room.deleteMany({}),
      Bed.deleteMany({})
    ]);

    // 2. Create Owner
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('owner123', salt);
    const owner = await User.create({
      name: 'System Owner',
      email: 'owner@hostelhub.com',
      password: hashedPassword,
      role: 'OWNER'
    });
    console.log('Created Owner:', owner.email);

    // 3. Create Building
    const building = await Building.create({
      name: 'Royal Palms Residency',
      address: '123 Tech Park Road, Whitefield, Bengaluru',
      locationCity: 'Bengaluru',
      description: 'A premium co-living space for working professionals and students.',
      startingPrice: 8500,
      genderType: 'Mixed',
      category: 'Professional',
      amenities: ['WiFi', 'CCTV', 'Power Backup', 'Gym', 'Laundry'],
      owner: owner._id,
      status: 'Active'
    });

    // 4. Create Floors
    const floor1 = await Floor.create({ floorNumber: 1, building: building._id, description: 'Ground Floor with Common Area' });
    const floor2 = await Floor.create({ floorNumber: 2, building: building._id, description: 'Residential Floor 1' });
    
    building.floors.push(floor1._id, floor2._id);
    await building.save();

    // 5. Create Rooms for Floor 1
    const room101 = await Room.create({
      roomNumber: '101', roomType: 'Double', capacity: 2, rentAmount: 9000, floor: floor1._id,
      isAC: true, washroomType: 'Attached', balcony: true, floorType: 'Marble'
    });
    const room102 = await Room.create({
      roomNumber: '102', roomType: 'Single', capacity: 1, rentAmount: 15000, floor: floor1._id,
      isAC: false, washroomType: 'Attached', balcony: false, floorType: 'Tiles'
    });

    floor1.rooms.push(room101._id, room102._id);
    await floor1.save();

    // 6. Create Beds for Room 101
    const bed101A = await Bed.create({ bedNumber: '101-A', status: 'OCCUPIED', room: room101._id, position: 'Window Side' });
    const bed101B = await Bed.create({ bedNumber: '101-B', status: 'AVAILABLE', room: room101._id, position: 'Door Side' });
    
    room101.beds.push(bed101A._id, bed101B._id);
    await room101.save();

    // 7. Create Bed for Room 102
    const bed102A = await Bed.create({ bedNumber: '102', status: 'AVAILABLE', room: room102._id });
    room102.beds.push(bed102A._id);
    await room102.save();

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
