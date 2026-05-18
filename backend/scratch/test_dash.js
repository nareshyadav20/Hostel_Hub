const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Building = require('../src/models/Building');
const Tenant = require('../src/models/Tenant');
const Payment = require('../src/models/Payment');
const Complaint = require('../src/models/Complaint');

async function testAggregation() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_hub');
    console.log("Connected.");

    const matchQuery = {};
    console.log("Running aggregation...");
    const stats = await Building.aggregate([
      { $match: matchQuery },
      { $lookup: { from: 'owner_floors', localField: 'floors', foreignField: '_id', as: 'floorData' } },
      { $unwind: { path: '$floorData', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'owner_rooms', localField: 'floorData.rooms', foreignField: '_id', as: 'roomData' } },
      { $unwind: { path: '$roomData', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'owner_beds', localField: 'roomData.beds', foreignField: '_id', as: 'bedData' } },
      { $unwind: { path: '$bedData', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalBeds: { $sum: { $cond: [{ $ifNull: ['$bedData', false] }, 1, 0] } },
          occupiedBeds: { $sum: { $cond: [{ $eq: ['$bedData.status', 'OCCUPIED'] }, 1, 0] } },
          maintenanceRooms: { $addToSet: { $cond: [{ $eq: ['$roomData.status', 'Maintenance'] }, '$roomData._id', null] } },
          buildingCount: { $addToSet: '$_id' }
        }
      }
    ]);

    console.log("Stats:", JSON.stringify(stats, null, 2));

    const totalTenants = await Tenant.countDocuments({});
    console.log("Total Tenants:", totalTenants);

    const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(); endOfDay.setHours(23,59,59,999);
    
    const paymentStats = await Payment.aggregate([
      { $match: {} },
      {
        $group: {
          _id: null,
          pendingCount: { $sum: { $cond: [{ $in: ['$status', ['Pending', 'Due']] }, 1, 0] } },
          pendingAmount: { $sum: { $cond: [{ $in: ['$status', ['Pending', 'Due']] }, '$amount', 0] } },
          todayRevenue: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$status', 'Paid'] },
                  { $gte: ['$date', startOfDay] },
                  { $lt: ['$date', endOfDay] }
                ]},
                '$amount',
                0
              ]
            }
          }
        }
      }
    ]);
    console.log("Payment Stats:", JSON.stringify(paymentStats, null, 2));

    mongoose.connection.close();
  } catch (err) {
    console.error("Aggregation Error:", err);
    process.exit(1);
  }
}

testAggregation();
