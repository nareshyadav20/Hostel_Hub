const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Building = require('../models/Building');
const Floor = require('../models/Floor');
const Room = require('../models/Room');
const Bed = require('../models/Bed');
const Tenant = require('../models/Tenant');
const CommunityReport = require('../models/tenant/CommunityReport');
const Reward = require('../models/tenant/Reward');
const Wishlist = require('../models/tenant/Wishlist');
const Booking = require('../models/Booking');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB for seeding...');

    // 1. Clear existing demo data
    await User.deleteMany({ email: 'demo@hostelhub.com' });
    await Tenant.deleteMany({ email: 'demo@hostelhub.com' });
    await Building.deleteMany({ name: { $in: ['Zenith Living', 'Urban Nest', 'The Hub'] } });
    
    // Clear reports, rewards, wishlists for these entities if necessary
    // (We'll skip complex cleanup for now as buildings are recreated with new IDs anyway)
    
    // 2. Create Demo User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const demoUser = await User.create({
      name: 'Demo Tenant',
      email: 'demo@hostelhub.com',
      phone: '9876543210',
      password: hashedPassword,
      role: 'TENANT'
    });
    console.log('Demo User created.');

    // 3. Create Tenant Profile
    const demoTenant = await Tenant.create({
      name: 'Demo Tenant',
      email: 'demo@hostelhub.com',
      phone: '9876543210',
      emergencyContact: '9000000000',
      room: 'A-102',
      rent: 8500,
      status: 'ACTIVE',
      rentStatus: 'PENDING',
      messPlan: 'premium',
      user: demoUser._id
    });
    
    // Update user with tenantId
    demoUser.tenantId = demoTenant._id;
    await demoUser.save();
    console.log('Tenant Profile created.');

    // 4. Create Mock Buildings (Hostels)
    const buildings = [
      {
        name: 'Zenith Living',
        address: 'Sector 4, HSR Layout, Bengaluru',
        locationCity: 'Bengaluru',
        description: 'A premium co-living space for working professionals with high-speed WiFi and laundry services.',
        amenities: ['WiFi', 'AC', 'Laundry', 'Security', 'Gym', 'Parking'],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'],
        startingPrice: 12000,
        genderType: 'Mixed',
        category: 'Luxury',
        rating: 4.9,
        popularityLabel: 'High Demand'
      },
      {
        name: 'Urban Nest',
        address: 'Near Madhapur Metro, Hyderabad',
        locationCity: 'Hyderabad',
        description: 'Vibrant student community living with focus on safety and nutrition.',
        amenities: ['WiFi', 'Mess', 'Security', 'Power Backup'],
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80'],
        startingPrice: 7500,
        genderType: 'Girls',
        category: 'Student',
        rating: 4.5
      },
      {
        name: 'The Hub',
        address: 'Andheri West, Mumbai',
        locationCity: 'Mumbai',
        description: 'Strategically located stay for corporate employees.',
        amenities: ['WiFi', 'AC', 'Cleaning', 'Security'],
        images: ['https://images.unsplash.com/photo-1502672260266-1c1c24240938?auto=format&fit=crop&w=1200&q=80'],
        startingPrice: 15000,
        genderType: 'Boys',
        category: 'Professional',
        rating: 4.7
      }
    ];

    const createdBuildings = await Building.insertMany(buildings);
    console.log(`${createdBuildings.length} Buildings created.`);

    // 5. Create Community Reports (Lost & Found)
    const reports = [
      {
        tenant: demoTenant._id,
        user: demoUser._id,
        title: 'Blue Water Bottle',
        type: 'Lost',
        location: 'Dining Hall',
        description: 'Milton 1L blue bottle left on table 4.',
        status: 'Open'
      },
      {
        tenant: demoTenant._id,
        user: demoUser._id,
        title: 'Silver Key Ring',
        type: 'Found',
        location: 'Main Entrance',
        description: 'Found a key ring with 3 keys near the gate.',
        status: 'Open'
      }
    ];
    await CommunityReport.insertMany(reports);
    console.log('Community Reports created.');

    // 6. Create Rewards
    await Reward.create({
      tenant: demoTenant._id,
      user: demoUser._id,
      points: 450,
      lifetimeEarned: 450,
      history: [
        { points: 100, reason: 'Profile Completion', type: 'Earned' },
        { points: 200, reason: 'Referral Bonus', type: 'Earned' },
        { points: 150, reason: 'Rent Paid Early', type: 'Earned' }
      ]
    });
    console.log('Reward balance initialized.');

    // 7. Create Wishlist
    const wishlistItems = [
      {
        tenant: demoTenant._id,
        user: demoUser._id,
        hostelId: createdBuildings[0]._id,
        hostelName: createdBuildings[0].name,
        hostelLocation: createdBuildings[0].address,
        hostelPrice: createdBuildings[0].startingPrice,
        hostelImage: createdBuildings[0].images[0],
        hostelRating: createdBuildings[0].rating,
        gender: createdBuildings[0].genderType,
        type: createdBuildings[0].category
      }
    ];
    await Wishlist.insertMany(wishlistItems);
    console.log('Wishlist items added.');

    // 8. Create Bookings
    await Booking.create({
      tenantId: demoTenant._id,
      buildingId: createdBuildings[0]._id,
      category: 'Single Elite',
      moveInDate: '2026-06-01',
      securityDeposit: 18000,
      onboardingFee: 2000,
      totalAmount: 20000,
      status: 'Confirmed'
    });
    console.log('Upcoming booking created.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
