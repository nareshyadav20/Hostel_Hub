const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Tenant = require('./src/models/Tenant');
const Building = require('./src/models/Building');
const Complaint = require('./src/models/Complaint');
const Laundry = require('./src/models/Laundry');

const validateData = async () => {
  try {
    await connectDB();
    
    const userCount = await User.countDocuments();
    const tenantCount = await Tenant.countDocuments();
    const buildingCount = await Building.countDocuments();
    const complaintCount = await Complaint.countDocuments();
    const laundryCount = await Laundry.countDocuments();
    
    console.log('--- Database Validation ---');
    console.log(`Users: ${userCount}`);
    console.log(`Tenants: ${tenantCount}`);
    console.log(`Buildings: ${buildingCount}`);
    console.log(`Complaints: ${complaintCount}`);
    console.log(`Laundry Orders: ${laundryCount}`);
    
    if (userCount > 0 && tenantCount > 0 && buildingCount > 0) {
      console.log('\nSUCCESS: Database is populated and connected correctly.');
    } else {
      console.log('\nFAILURE: Some data is missing.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Validation failed:', error);
    process.exit(1);
  }
};

validateData();
