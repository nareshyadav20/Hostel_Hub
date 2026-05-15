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

    // 3. Create Multiple Buildings
    const building1 = await Building.create({
      name: 'Royal Palms Residency',
      address: '123 Tech Park Road, Whitefield, Bengaluru',
      locationCity: 'Bengaluru',
      description: 'A premium co-living space for working professionals.',
      startingPrice: 8500, genderType: 'Mixed', category: 'Luxury',
      amenities: ['WiFi', 'CCTV', 'Power Backup', 'Gym', 'Laundry'],
      smartConfig: { hasSmartAccess: true, hasClimateControl: true, hasAirQualityMonitor: true, hasAIHygiene: true, hasCCTVAi: true, targetComfortScore: 92 },
      owner: owner._id, status: 'Active'
    });

    const building2 = await Building.create({
      name: 'Grand Suites Hostel',
      address: '45 MG Road, Indiranagar, Bengaluru',
      locationCity: 'Bengaluru',
      description: 'Affordable and secure student accommodation.',
      startingPrice: 6500, genderType: 'Boys', category: 'Student',
      amenities: ['WiFi', 'CCTV', '24/7 Water'],
      smartConfig: { hasSmartAccess: true, hasClimateControl: false, hasAirQualityMonitor: false, hasAIHygiene: true, hasCCTVAi: false, targetComfortScore: 75 },
      owner: owner._id, status: 'Active'
    });

    const building3 = await Building.create({
      name: 'TechPG Premium',
      address: 'Electronic City Phase 1, Bengaluru',
      locationCity: 'Bengaluru',
      description: 'High-tech PG for software engineers.',
      startingPrice: 12000, genderType: 'Girls', category: 'Professional',
      amenities: ['WiFi', 'Gym', 'Food Included', 'AC'],
      smartConfig: { hasSmartAccess: true, hasClimateControl: true, hasAirQualityMonitor: true, hasAIHygiene: false, hasCCTVAi: true, targetComfortScore: 88 },
      owner: owner._id, status: 'Active'
    });

    const building4 = await Building.create({
      name: 'Serene Living PG',
      address: 'Koramangala 4th Block, Bengaluru',
      locationCity: 'Bengaluru',
      description: 'Quiet and peaceful stay in the heart of the city.',
      startingPrice: 9500, genderType: 'Mixed', category: 'Mixed',
      amenities: ['WiFi', 'Laundry', 'Parking'],
      smartConfig: { hasSmartAccess: false, hasClimateControl: false, hasAirQualityMonitor: true, hasAIHygiene: true, hasCCTVAi: false, targetComfortScore: 82 },
      owner: owner._id, status: 'Active'
    });

    // 4. Create Floors & Rooms for the first building
    const floor1 = await Floor.create({ floorNumber: 1, building: building1._id, description: 'Ground Floor' });
    building1.floors.push(floor1._id);
    await building1.save();

    const room101 = await Room.create({
      roomNumber: '101', roomType: 'Double', capacity: 2, rentAmount: 9000, floor: floor1._id,
      isAC: true, washroomType: 'Attached', hygieneRating: 4.8, ventilationScore: 85, naturalLightScore: 90, tempComfortScore: 82, studyFriendly: true, smartLock: true
    });
    floor1.rooms.push(room101._id);
    await floor1.save();

    const bed101A = await Bed.create({ bedNumber: '101-A', status: 'OCCUPIED', room: room101._id, position: 'Window Side', comfortScore: 88, lastSanitized: new Date() });
    const bed101B = await Bed.create({ bedNumber: '101-B', status: 'AVAILABLE', room: room101._id, position: 'Door Side', comfortScore: 85, lastSanitized: new Date() });
    room101.beds.push(bed101A._id, bed101B._id);
    await room101.save();

    // Create a few tenants to populate stats
    const Tenant = require('./models/Tenant');
    await Tenant.create({ 
      name: 'John Doe', email: 'john@example.com', phone: '9876543210', 
      emergencyContact: '9000000000',
      buildingId: building1._id, roomId: room101._id, bedId: bed101A._id, status: 'ACTIVE' 
    });

    console.log('Seeding completed with multiple properties!');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
