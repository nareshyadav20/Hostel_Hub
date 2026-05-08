const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function businessAudit() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- DATABASE BUSINESS AUDIT START ---');
    
    const db = mongoose.connection.db;
    
    // 1. Check Tenants
    const tenants = await db.collection('owner_tenants').find({}).toArray();
    const buildings = await db.collection('owner_buildings').find({}).toArray();
    const rooms = await db.collection('owner_rooms').find({}).toArray();
    const beds = await db.collection('owner_beds').find({}).toArray();
    
    console.log(`Auditing ${tenants.length} tenants...`);
    let tenantIssues = 0;
    for (const t of tenants) {
      if (!t.buildingId) {
        console.warn(`[ISSUE] Tenant ${t.name} has NO buildingId!`);
        tenantIssues++;
      }
      if (!t.roomId) {
        console.warn(`[ISSUE] Tenant ${t.name} has NO roomId!`);
        tenantIssues++;
      }
    }
    
    // 2. Check Bed Sync
    console.log(`Auditing ${beds.length} beds...`);
    let bedIssues = 0;
    for (const b of beds) {
      const occupant = tenants.find(t => t.bedId && t.bedId.toString() === b._id.toString());
      if (b.status === 'OCCUPIED' && !occupant) {
        console.warn(`[ISSUE] Bed ${b.bedNumber} in Room ${b.roomId} is marked OCCUPIED but has NO tenant!`);
        bedIssues++;
      } else if (b.status === 'VACANT' && occupant) {
        console.warn(`[ISSUE] Bed ${b.bedNumber} in Room ${b.roomId} is marked VACANT but is occupied by ${occupant.name}!`);
        bedIssues++;
      }
    }
    
    // 3. Check Payments
    const payments = await db.collection('owner_payments').find({}).toArray();
    console.log(`Auditing ${payments.length} payments...`);
    let paymentIssues = 0;
    for (const p of payments) {
      const tenantExists = tenants.find(t => t._id.toString() === p.tenantId?.toString());
      if (!tenantExists) {
        console.warn(`[ISSUE] Payment of ${p.amount} (${p._id}) is linked to a NON-EXISTENT tenant!`);
        paymentIssues++;
      }
    }
    
    console.log('--- AUDIT SUMMARY ---');
    console.log(`Tenant Issues: ${tenantIssues}`);
    console.log(`Bed Sync Issues: ${bedIssues}`);
    console.log(`Payment Issues: ${paymentIssues}`);
    
    if (tenantIssues + bedIssues + paymentIssues === 0) {
      console.log('SUCCESS: All business logic is consistent and healthy!');
    } else {
      console.warn('ACTION REQUIRED: Some data inconsistencies were found.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Audit Failed:', err);
    process.exit(1);
  }
}

businessAudit();
