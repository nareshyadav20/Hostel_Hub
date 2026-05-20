const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Models
const Building = require('../models/Building');
const Floor = require('../models/Floor');
const Room = require('../models/Room');
const Bed = require('../models/Bed');
const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    // Clear existing data in owner_ collections
    console.log('Clearing existing owner_ collections...');
    await Building.deleteMany({});
    await Floor.deleteMany({});
    await Room.deleteMany({});
    await Bed.deleteMany({});
    await Tenant.deleteMany({});
    await Payment.deleteMany({});
    await Complaint.deleteMany({});
    console.log('Cleared.');

    // Ensure we have a valid owner user in MongoDB
    console.log('Checking for active Owner...');
    let ownerUser = await User.findOne({ role: 'OWNER' });
    if (!ownerUser) {
      console.log('No active owner found. Registering a default platform owner...');
      ownerUser = await User.create({
        name: 'Srinu Owner',
        email: 'owner@hostelhub.com',
        password: 'password123',
        role: 'OWNER',
        phone: '9998887776'
      });
      console.log('Default owner registered.');
    } else {
      console.log(`Using existing owner: "${ownerUser.name}"`);
    }

    const buildingsData = [
      { name: 'Alpha Tower', address: 'North Campus, Tech Park', locationCity: 'Bengaluru', description: 'Premium Boys Hostel', amenities: ['WiFi', 'AC', 'CCTV', 'Laundry', 'Gym'], images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'], genderType: 'Boys', category: 'Student', rating: 4.8, owner: ownerUser._id },
    ];

    for (const bData of buildingsData) {
      const building = await Building.create(bData);
      console.log(`Created Building: ${building.name}`);

      // Create 2 floors
      for (let f = 1; f <= 2; f++) {
        const floor = await Floor.create({
          buildingId: building._id,
          floorNumber: `${f}${f === 1 ? 'st' : 'nd'} Floor`
        });
        building.floors.push(floor._id);
        await building.save();

        // Create 3 rooms per floor (Total 6)
        for (let r = 1; r <= 3; r++) {
          const room = await Room.create({
            floorId: floor._id,
            roomNumber: `${f}0${r}`,
            roomType: 'Double',
            capacity: 2,
            isAC: true
          });
          floor.rooms.push(room._id);
          await floor.save();

          // Create 2 beds per room (Total 6 beds per floor)
          for (let b = 1; b <= room.capacity; b++) {
            const isOccupied = (f === 1 && (r < 3 || (r === 3 && b === 1))) || (f === 2); // 1st: 5/6, 2nd: 6/6
            const bed = await Bed.create({
              roomId: room._id,
              bedNumber: `${room.roomNumber}${String.fromCharCode(64 + b)}`,
              status: isOccupied ? 'OCCUPIED' : 'AVAILABLE'
            });
            room.beds.push(bed._id);
            await room.save();
            
            if (isOccupied) {
              const tenantName = `Tenant ${Math.floor(Math.random() * 1000)}`;
              const tenant = await Tenant.create({
                name: tenantName,
                phone: `98765${Math.floor(10000 + Math.random() * 90000)}`,
                email: `${tenantName.toLowerCase().replace(' ', '')}@example.com`,
                emergencyContact: '9876543210',
                buildingId: building._id,
                floorId: floor._id,
                roomId: room._id,
                bedId: bed._id,
                rent: 8500,
                checkInDate: new Date(),
                status: 'ACTIVE'
              });
              
              bed.tenantId = tenant._id;
              await bed.save();

              await Payment.create({
                tenantId: tenant._id,
                buildingId: building._id,
                amount: tenant.rent,
                status: 'Paid',
                date: new Date(),
                method: 'UPI',
                invoice: `INV-${Date.now()}-${Math.floor(Math.random() * 10000)}`
              });
            }
          }
        }
      }
    }

    console.log('Seeding complete successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
