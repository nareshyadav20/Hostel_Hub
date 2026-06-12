const mongoose = require('mongoose');
const Building = require('./src/models/Building');
const dotenv = require('dotenv');

dotenv.config();

const CITIES = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Chennai', 'Delhi', 'Pune', 'Noida', 'Gurgaon'];
const CATEGORIES = [
  { genderType: 'Boys', category: 'Student' }, // Mens & Student
  { genderType: 'Girls', category: 'Student' }, // Womens & Student
  { genderType: 'Mixed', category: 'Co-living' }, // Coliving
  { genderType: 'Mixed', category: 'Premium' }, // Premium
  { genderType: 'Boys', category: 'Professional' }, // Mens
  { genderType: 'Girls', category: 'Professional' } // Womens
];

const AMENITIES = ['WiFi', 'CCTV', 'Power Backup', 'Gym', 'Laundry', 'Meals', 'AC'];

const generateMockData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_hub');
    console.log('Connected to MongoDB. Clearing old balanced mock data...');
    
    // We'll delete buildings that look like our mock data to avoid infinite growth
    await Building.deleteMany({ name: { $regex: 'Mock' } });

    console.log('Generating balanced properties...');
    const ownerId = '654321098765432109876543'; // Dummy owner ID

    const buildings = [];
    let counter = 1;

    for (const city of CITIES) {
      // Create 15 properties per city
      for (let i = 0; i < 15; i++) {
        const catCombo = CATEGORIES[i % CATEGORIES.length];
        buildings.push({
          name: `${city} Mock Property ${counter++}`,
          address: `123 Main St, ${city}`,
          locationCity: city,
          description: `A beautiful ${catCombo.category} stay in ${city}.`,
          startingPrice: 5000 + Math.floor(Math.random() * 10000),
          genderType: catCombo.genderType,
          category: catCombo.category,
          amenities: AMENITIES.slice(0, 3 + Math.floor(Math.random() * 4)),
          images: [],
          status: 'Active',
          owner: ownerId,
          showInPortfolio: true
        });
      }
    }

    await Building.insertMany(buildings);
    console.log(`Successfully generated ${buildings.length} balanced properties.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

generateMockData();
