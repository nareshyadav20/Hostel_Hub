const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Building = require('./models/Building');
const Floor = require('./models/Floor');
const Room = require('./models/Room');
const Bed = require('./models/Bed');
const Tenant = require('./models/Tenant');
const Complaint = require('./models/Complaint');
const Payment = require('./models/Payment');
const MessMenu = require('./models/MessMenu');
const Inventory = require('./models/Inventory');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_hub');
    console.log('Connected to MongoDB for final production seeding...');

    // 1. Clear existing data
    await Promise.all([
      User.deleteMany({ role: { $in: ['OWNER', 'STAFF', 'TENANT'] } }),
      Building.deleteMany({}),
      Floor.deleteMany({}),
      Room.deleteMany({}),
      Bed.deleteMany({}),
      Tenant.deleteMany({}),
      Complaint.deleteMany({}),
      Payment.deleteMany({}),
      MessMenu.deleteMany({}),
      Inventory.deleteMany({})
    ]);

    // 2. Create Owner
    const salt = await bcrypt.genSalt(10);
    const ownerPassword = await bcrypt.hash('password123', salt);
    const owner = await User.create({
      name: 'Naresh Yadav',
      email: 'owner@hostelhub.com',
      password: ownerPassword,
      role: 'OWNER'
    });

    // 3. Create Staff
    const staffPassword = await bcrypt.hash('staff123', salt);
    await User.create({
      name: 'Suresh Mani',
      email: 'warden@hostelhub.com',
      password: staffPassword,
      role: 'STAFF'
    });

    // 4. Create Buildings
    const buildingsData = [
      { name: 'Royal Palms Residency', address: 'Whitefield, Bengaluru', category: 'Professional', status: 'Active' },
      { name: 'Skyline Suites', address: 'Koramangala, Bengaluru', category: 'Student', status: 'Active' },
      { name: 'Emerald Heights', address: 'HSR Layout, Bengaluru', category: 'Student', status: 'Active' },
      { name: 'Heritage Residency', address: 'MG Road, Bengaluru', category: 'Professional', status: 'Draft' }
    ];

    const buildings = [];
    for (const bData of buildingsData) {
      const b = await Building.create({
        ...bData,
        description: `Premium ${bData.category} residency.`,
        startingPrice: 8000,
        genderType: 'Mixed',
        amenities: ['WiFi', 'CCTV', 'Power Backup'],
        owner: owner._id
      });
      buildings.push(b);

      // Add one floor, room, and bed to each building for dashboard stats
      const floor = await Floor.create({ floorNumber: '1', building: b._id, description: 'Ground Floor' });
      b.floors.push(floor._id);
      await b.save();

      const room = await Room.create({
        roomNumber: '101', roomType: 'Double', capacity: 2, rentAmount: 9000, floor: floor._id,
        isAC: true, washroomType: 'Attached', status: 'AVAILABLE'
      });
      floor.rooms.push(room._id);
      await floor.save();

      const bedA = await Bed.create({ bedNumber: '101-A', status: 'AVAILABLE', room: room._id });
      const bedB = await Bed.create({ bedNumber: '101-B', status: 'AVAILABLE', room: room._id });
      room.beds.push(bedA._id, bedB._id);
      await room.save();

      // Add a tenant to the first building only for variety, or all? 
      // Let's add at least one tenant to each Active building.
      if (b.status === 'Active') {
        const tenantUser = await User.create({
          name: `Tenant ${b.name}`,
          email: `tenant_${b._id}@example.com`,
          password: staffPassword,
          role: 'TENANT'
        });

        const tenant = await Tenant.create({
          name: `Tenant ${b.name}`,
          email: tenantUser.email,
          phone: '9876543210',
          emergencyContact: '9123456789',
          buildingId: b._id,
          room: room.roomNumber,
          rent: 9000,
          status: 'ACTIVE',
          aadhaarNumber: '123456789012'
        });

        await Bed.findByIdAndUpdate(bedA._id, { status: 'OCCUPIED', tenantId: tenant._id });
        
        // Add a payment for each tenant
        await Payment.create({
          tenantId: tenant._id,
          buildingId: b._id,
          amount: 9000,
          type: 'Rent',
          status: 'Paid',
          month: 'May 2024',
          method: 'UPI',
          invoice: `INV-${b._id}-01`,
          date: new Date()
        });
      }
    }

    // 10. Mess Menu (Global for standard plan)
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const day of days) {
      await MessMenu.create({
        plan: 'standard',
        day,
        breakfast: 'Aloo Paratha',
        lunch: 'Rice, Dal, Veg',
        dinner: 'Roti, Paneer'
      });
    }

    // 11. Inventory Seeding
    for (const b of buildings) {
      if (b.status === 'Active') {
        await Inventory.create([
          { name: 'Bed Sheets', type: 'Asset', category: 'Linen', stock: 50, maxStock: 60, minThreshold: 10, unit: 'Sets', location: 'Storage Room A', buildingId: b._id },
          { name: 'Pillow Covers', type: 'Asset', category: 'Linen', stock: 100, maxStock: 120, minThreshold: 20, unit: 'Units', location: 'Storage Room A', buildingId: b._id },
          { name: 'LED Bulbs (9W)', type: 'Consumable', category: 'Electrical', stock: 5, maxStock: 30, minThreshold: 10, unit: 'Units', location: 'Maintenance Hub', buildingId: b._id },
          { name: 'Towel Sets', type: 'Asset', category: 'Linen', stock: 40, maxStock: 50, minThreshold: 15, unit: 'Sets', location: 'Storage Room B', buildingId: b._id },
          { name: 'Cleaning Liquid', type: 'Consumable', category: 'Housekeeping', stock: 12, maxStock: 20, minThreshold: 5, unit: 'Litres', location: 'Janitor Closet', buildingId: b._id }
        ]);
      }
    }

    console.log('Seed v2.2: Balanced Global Production Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
