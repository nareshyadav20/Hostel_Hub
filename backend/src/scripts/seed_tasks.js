const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('../models/Task');

dotenv.config();

const seedTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    await Task.deleteMany({}); // Clear existing

    const tasks = [
      {
        title: 'Review Quarterly Utility Bills',
        category: 'Finance',
        assignedTo: 'Rajesh Kumar',
        dueDate: '14 May 2024',
        status: 'Pending',
        priority: 'High',
        desc: 'Verify the electricity and water bills for Sapphire PG and Elite Living for the Q1 period.',
        history: [
          { status: 'Created', time: '10 May', user: 'Admin' },
          { status: 'Assigned', time: '11 May', user: 'Rajesh K.' }
        ]
      },
      {
        title: 'Fix Leakage in Room 304',
        category: 'Maintenance',
        assignedTo: 'Suresh V.',
        dueDate: 'Today',
        status: 'In Progress',
        priority: 'Critical',
        desc: 'Major pipe burst in the bathroom ceiling. Requires immediate plumbing intervention.',
        history: [
          { status: 'Created', time: 'Today 08:00 AM', user: 'System' },
          { status: 'Started', time: 'Today 09:30 AM', user: 'Suresh V.' }
        ]
      },
      {
        title: 'Renew AMC for Elevator',
        category: 'Admin',
        assignedTo: 'Anita Singh',
        dueDate: '20 May 2024',
        status: 'Completed',
        priority: 'Medium',
        desc: 'Annual Maintenance Contract renewal for the main elevator in Block B.',
        history: [
          { status: 'Created', time: '05 May', user: 'Admin' },
          { status: 'Completed', time: '11 May', user: 'Anita S.' }
        ]
      },
      {
        title: 'Tenant Verification Audit',
        category: 'Residents',
        assignedTo: 'Vikram Mehta',
        dueDate: '16 May 2024',
        status: 'Pending',
        priority: 'Low',
        desc: 'Random check of KYC documents for newly moved-in tenants in Sapphire PG.',
        history: [
          { status: 'Created', time: '11 May', user: 'Admin' }
        ]
      }
    ];

    await Task.insertMany(tasks);
    console.log('Tasks seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding tasks:', err);
    process.exit(1);
  }
};

seedTasks();
