const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Tenant = require('./src/models/Tenant');
const Building = require('./src/models/Building');
const Floor = require('./src/models/Floor');
const Room = require('./src/models/Room');
const Complaint = require('./src/models/Complaint');
const Laundry = require('./src/models/Laundry');

const seedHeavyData = async () => {
  try {
    await connectDB();
    
    console.log('Cleaning existing data for performance seed...');
    await Promise.all([
      User.deleteMany({ role: 'TENANT' }),
      Tenant.deleteMany({}),
      Building.deleteMany({}),
      Floor.deleteMany({}),
      Room.deleteMany({}),
      Complaint.deleteMany({}),
      Laundry.deleteMany({})
    ]);
    
    console.log('Seeding 10 Sample Buildings...');
    const buildings = [];
    for (let i = 1; i <= 10; i++) {
      const b = await Building.create({
        name: `Hostel Premium ${i}`,
        address: `${i * 100} MG Road, Bengaluru`,
        description: `High-performance living space #${i} with all modern amenities.`,
        amenities: ['WiFi', 'AC', 'Gym', 'Mess', 'Laundry', 'Security'],
        startingPrice: 5000 + (i * 500),
        images: [`https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80`]
      });
      buildings.push(b);
    }

    console.log('Seeding Primary Test User...');
    const mainTenant = await Tenant.create({
      name: 'Performance Tester',
      email: 'tenant@example.com',
      phone: '9998887776',
      emergencyContact: '1112223334',
      room: 'A-302',
      rent: 7500,
      status: 'ACTIVE',
      rentStatus: 'PENDING',
      aadhaarNumber: '1111-2222-3333'
    });

    const mainUser = await User.create({
      name: 'Performance Tester',
      email: 'tenant@example.com',
      password: 'password',
      role: 'TENANT',
      phone: '9998887776',
      tenantId: mainTenant._id
    });

    console.log('Seeding 50+ Complaints for the test user...');
    const categories = ['Maintenance', 'Housekeeping', 'WiFi / IT', 'Other'];
    const statuses = ['Pending', 'Resolved', 'In Progress'];
    
    const complaints = [];
    for (let i = 1; i <= 55; i++) {
      complaints.push({
        title: `Service Issue #${i}`,
        description: `This is a generated performance test complaint number ${i}.`,
        category: categories[i % categories.length],
        status: i % 5 === 0 ? 'Resolved' : 'Pending',
        tenant: mainTenant._id,
        user: mainUser._id,
        createdAt: new Date(Date.now() - (i * 3600000)) // Spaced out by hours
      });
    }
    await Complaint.insertMany(complaints);

    console.log('Seeding 25 Laundry Orders...');
    const laundryStatuses = ['Picked', 'Washing', 'Ironing', 'Ready', 'Delivered'];
    const laundryOrders = [];
    for (let i = 1; i <= 25; i++) {
      laundryOrders.push({
        orderNumber: `L-${10000 + i}`,
        status: laundryStatuses[i % laundryStatuses.length],
        tenant: mainTenant._id,
        user: mainUser._id,
        createdAt: new Date(Date.now() - (i * 86400000)) // Spaced out by days
      });
    }
    await Laundry.insertMany(laundryOrders);

    console.log('\n--- PERFORMANCE DATA SEEDED ---');
    console.log('Total Buildings: 10');
    console.log('Total Complaints: 55');
    console.log('Total Laundry Orders: 25');
    console.log('\nLogin: tenant@example.com / password');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding heavy data:', error);
    process.exit(1);
  }
};

seedHeavyData();
