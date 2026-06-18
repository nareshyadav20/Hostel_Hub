const mongoose = require('mongoose');
const Building = require('./src/models/Building');
const dotenv = require('dotenv');

dotenv.config();

const HOSTELS = [
  {
    name: 'Stanza Living - Koramangala Men\'s',
    address: '80ft Road, Bengaluru (Koramangala)',
    locationCity: 'Bengaluru',
    description: 'A premium stay for men located in the heart of Koramangala, featuring high-speed WiFi and AC.',
    startingPrice: 12000,
    rentSingle: 20000,
    rentDouble: 15000,
    rentTriple: 12000,
    genderType: 'Boys',
    category: 'Luxury',
    amenities: ['WiFi', 'AC', 'Food/Mess', 'CCTV', 'Gym'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800']
  },
  {
    name: 'NestAway Coliving - HSR',
    address: 'Sector 2, Bengaluru (HSR Layout)',
    locationCity: 'Bengaluru',
    description: 'Modern co-living space for professionals and students. Fully furnished.',
    startingPrice: 10000,
    rentSingle: 18000,
    rentDouble: 10000,
    genderType: 'Mixed',
    category: 'Professional',
    amenities: ['WiFi', 'Power Backup', 'Laundry', 'Parking'],
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800']
  },
  {
    name: 'Zolo Stay Women\'s PG',
    address: 'Near Tech Park, Hyderabad (HITEC City)',
    locationCity: 'Hyderabad',
    description: 'Safe and secure women\'s PG near HITEC City with bio-metric access and CCTV.',
    startingPrice: 8500,
    rentTriple: 8500,
    rent4Sharing: 7500,
    genderType: 'Girls',
    category: 'Student',
    amenities: ['CCTV', 'Food/Mess', 'Washing Machine', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800']
  },
  {
    name: 'CoLive Gachibowli',
    address: 'Main Road, Hyderabad (Gachibowli)',
    locationCity: 'Hyderabad',
    description: 'Premium co-living space near top universities and offices.',
    startingPrice: 15000,
    rentSingle: 25000,
    rentDouble: 15000,
    genderType: 'Mixed',
    category: 'Professional',
    amenities: ['Gym', 'AC', 'WiFi', 'Power Backup', 'Library'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800']
  },
  {
    name: 'YourSpace Student Housing',
    address: 'North Campus, Delhi (Karol Bagh)',
    locationCity: 'Delhi',
    description: 'Vibrant student housing in North Campus with amazing food and study areas.',
    startingPrice: 11000,
    rentDouble: 15000,
    rentTriple: 11000,
    genderType: 'Mixed',
    category: 'Student',
    amenities: ['Food/Mess', 'WiFi', 'Study Room', 'Laundry'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800']
  },
  {
    name: 'Isthara Coliving Powai',
    address: 'Lake View Road, Mumbai (Powai)',
    locationCity: 'Mumbai',
    description: 'Luxury co-living overlooking Powai Lake. Ideal for professionals.',
    startingPrice: 22000,
    rentSingle: 35000,
    rentDouble: 22000,
    genderType: 'Mixed',
    category: 'Luxury',
    amenities: ['Gym', 'Pool', 'AC', 'WiFi', 'CCTV'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1c24240f57?auto=format&fit=crop&q=80&w=800']
  },
  {
    name: 'SmartStay Boys PG',
    address: 'Anna Salai, Chennai (T-Nagar)',
    locationCity: 'Chennai',
    description: 'Budget friendly boys PG in the heart of T-Nagar.',
    startingPrice: 6500,
    rent4Sharing: 6500,
    rent5Sharing: 5500,
    genderType: 'Boys',
    category: 'Student',
    amenities: ['Food/Mess', 'WiFi', 'Parking'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800']
  },
  {
    name: 'Elite Girls PG',
    address: 'Kalyani Nagar, Pune (Kalyani Nagar)',
    locationCity: 'Pune',
    description: 'Premium girls PG in Pune\'s best residential area. Super safe.',
    startingPrice: 14000,
    rentDouble: 14000,
    rentTriple: 11000,
    genderType: 'Girls',
    category: 'Professional',
    amenities: ['AC', 'WiFi', 'Food/Mess', 'CCTV'],
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800']
  },
  {
    name: 'Sector 62 Professional Stays',
    address: 'Block A, Noida (Sector 62)',
    locationCity: 'Noida',
    description: 'Affordable co-living spaces for working professionals in Noida.',
    startingPrice: 9000,
    rentSingle: 15000,
    rentDouble: 9000,
    genderType: 'Mixed',
    category: 'Mixed',
    amenities: ['WiFi', 'Power Backup', 'Laundry'],
    images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800']
  },
  {
    name: 'Cyber City Men\'s Residency',
    address: 'Phase 3, Gurgaon (Cyber City)',
    locationCity: 'Gurgaon',
    description: 'Executive men\'s accommodation near Cyber City offices.',
    startingPrice: 16000,
    rentSingle: 28000,
    rentDouble: 16000,
    genderType: 'Boys',
    category: 'Professional',
    amenities: ['AC', 'WiFi', 'Gym', 'Parking', 'Food/Mess'],
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800']
  }
];

const generateTenHostels = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_hub');
    console.log('Connected to MongoDB.');

    const ownerId = '654321098765432109876543'; // Dummy owner ID

    const formattedHostels = HOSTELS.map(h => ({
      ...h,
      status: 'Active',
      owner: ownerId,
      showInPortfolio: true
    }));

    await Building.insertMany(formattedHostels);
    console.log(\`Successfully generated \${formattedHostels.length} unique hostels.\`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

generateTenHostels();
