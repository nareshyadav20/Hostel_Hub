const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Configure dotenv
dotenv.config({ path: path.join(__dirname, '../../.env') });

const AdminCms = require('../models/AdminCms');
const AdminInsights = require('../models/AdminInsights');
const AdminSupport = require('../models/AdminSupport');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/hostel_hub';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // 1. Seed CMS data
    console.log('Seeding CMS data...');
    await AdminCms.deleteMany({});
    const cmsDoc = await AdminCms.create({
      pages: [
        { name: 'Home Landing', lastEdit: '2h ago', status: 'Published', headline: 'Find Luxury Living That Fits Your Budget', meta: "HostelHub is India's leading platform for verified, high-quality hostels.", bodyContent: "# Welcome Section\n\n[Component: StatisticsGrid]\n[Component: FeaturedHostels]\n[Component: MobileAppBanner]\n\n### Call to Action\nJoin 15,000+ satisfied residents today." },
        { name: 'FAQ / Support', lastEdit: '5 days ago', status: 'Published', headline: 'How can we help you?', meta: 'Find answers to frequently asked questions about booking and operations.', bodyContent: '# FAQs' },
        { name: 'Privacy Policy', lastEdit: 'Oct 20, 2024', status: 'Draft', headline: 'Privacy Policy', meta: 'Your privacy is important to us.', bodyContent: '# Privacy Policy details' },
      ],
      banners: [
        { title: 'New Year Special', size: '1200×400', active: true },
        { title: 'Referral Program', size: '1200×400', active: false },
      ],
      seoSettings: {
        headline: "HostelHub - India's Premier Hostel Hub",
        meta: "HostelHub is India's leading platform for verified, high-quality hostels."
      }
    });
    console.log('CMS data seeded successfully:', cmsDoc._id);

    // 2. Seed Insights data
    console.log('Seeding Insights data...');
    await AdminInsights.deleteMany({});
    const insightsDoc = await AdminInsights.create({
      radarData: [
        { subject: 'Occupancy', A: 120, fullMark: 150 },
        { subject: 'Revenue', A: 98, fullMark: 150 },
        { subject: 'Retention', A: 86, fullMark: 150 },
        { subject: 'Maintenance', A: 99, fullMark: 150 },
        { subject: 'Efficiency', A: 85, fullMark: 150 },
        { subject: 'Growth', A: 65, fullMark: 150 },
      ],
      forecastData: [
        { name: 'W1', val: 70 }, { name: 'W2', val: 75 }, { name: 'W3', val: 82 }, 
        { name: 'W4', val: 78 }, { name: 'W5', val: 85 }, { name: 'W6', val: 92 },
        { name: 'W7', val: 95 }, { name: 'W8', val: 88 }, { name: 'W9', val: 99 }
      ],
      efficiencyTarget: '94% / 100%',
      recommendations: [
        { title: 'Dynamic Pricing Opportunity', desc: 'Predicting 18% surge in Pune demand. Suggesting 5% price adjustment for vacant units.', color: 'primary' },
        { title: 'Retention Risk Alert', desc: '3 tenants in Bangalore show 85% churn probability due to service lag. Issue urgent maintenance voucher.', color: 'danger' },
        { title: 'Energy Optimization', desc: 'Auto-adjust HVAC schedules in common areas to save 12% on utility costs this month.', color: 'success' }
      ]
    });
    console.log('Insights data seeded successfully:', insightsDoc._id);

    // 3. Seed Support data
    console.log('Seeding Support data...');
    await AdminSupport.deleteMany({});
    const supportDoc = await AdminSupport.create({
      categories: [
        { id: 'General', label: 'General Info' },
        { id: 'Payments', label: 'Billing & Payments' },
        { id: 'Tenants', label: 'Tenant Relations' },
        { id: 'Properties', label: 'Property Assets' },
        { id: 'Technical', label: 'System Help' },
      ],
      faqs: [
        {
          id: 1,
          cat: 'Payments',
          q: 'How do I generate a bulk rent manifest for all properties?',
          a: 'Navigate to the Finance Hub, select the current period, and click the "Excel" or "PDF" export cluster in the header. The system will automatically generate a consolidated fiscal manifest.',
        },
        {
          id: 2,
          cat: 'Tenants',
          q: 'How can I offboard a tenant with pending dues?',
          a: 'Go to the Residents manifest, select the tenant, and expand their profile. Use the "Decision Matrix" to initiate the Offboarding protocol. The system will prompt you to resolve outstanding dues before finalization.',
        },
        {
          id: 3,
          cat: 'General',
          q: 'How do I switch between Light and Dark mode?',
          a: 'The theme toggle is located in the top bar actions cluster, next to the notifications bell. Switching themes will instantly recalibrate all tactical UI tokens.',
        },
        {
          id: 4,
          cat: 'Technical',
          q: 'System is showing Recharts dimension warnings. Is this critical?',
          a: 'No, these are standard layout warnings during high-velocity UI transitions. I have implemented min-dimension containers to silence these warnings in the latest manifest deployment.',
        },
      ],
      tickets: [
        { id: 'STK-4011', subject: 'API Integration Timeout', status: 'In Progress', priority: 'High', time: '2h ago' },
        { id: 'STK-4009', subject: 'Incorrect Tax Calculation', status: 'Resolved', priority: 'Medium', time: '1d ago' },
      ],
      chatLogs: [
        { from: 'agent', text: 'Hello! Welcome to StayNest Admin Support. How can I assist you today?', time: 'Just now' }
      ]
    });
    console.log('Support data seeded successfully:', supportDoc._id);

    console.log('All admin modules database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed with error:', err);
    process.exit(1);
  }
};

seedData();
