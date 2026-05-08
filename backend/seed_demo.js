const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const OWNER_ID = '69f9974e393c3bc254a00ba1'; // Preserving your primary owner account

async function seedDemo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for Demo Seeding...');

    const db = mongoose.connection.db;

    // 1. CLEAR COLLECTIONS
    const collections = [
      'owner_buildings', 'owner_floors', 'owner_rooms', 'owner_beds', 
      'owner_tenants', 'owner_payments', 'owner_complaints', 
      'owner_inventory', 'owner_messmenus', 'owner_staff', 'owner_systemsettings'
    ];
    
    for (const col of collections) {
      await db.collection(col).deleteMany({});
      console.log(`Cleared: ${col}`);
    }

    // 2. CREATE BUILDINGS
    const buildingsData = [
      { name: 'Elite Skyline Residency', address: 'Banjara Hills, Hyderabad', startingPrice: 12000, genderType: 'Mixed', category: 'Professional', owner: new mongoose.Types.ObjectId(OWNER_ID) },
      { name: 'Greenwood Students PG', address: 'Kondapur, Hyderabad', startingPrice: 7500, genderType: 'Boys', category: 'Student', owner: new mongoose.Types.ObjectId(OWNER_ID) },
      { name: 'Silicon Valley Stay', address: 'Hitech City, Hyderabad', startingPrice: 15000, genderType: 'Girls', category: 'Professional', owner: new mongoose.Types.ObjectId(OWNER_ID) }
    ];
    
    const buildings = [];
    for (const b of buildingsData) {
      const res = await db.collection('owner_buildings').insertOne({ ...b, status: 'Active', createdAt: new Date(), updatedAt: new Date() });
      buildings.push({ ...b, _id: res.insertedId });
    }

    // 3. CREATE FLOORS, ROOMS, BEDS (Structured for Building 1)
    console.log('Generating Property Hierarchy...');
    const b1 = buildings[0];
    for (let fNum = 1; fNum <= 3; fNum++) {
      const floorRes = await db.collection('owner_floors').insertOne({
        floorNumber: fNum,
        buildingId: b1._id,
        status: 'Active'
      });
      const floorId = floorRes.insertedId;
      await db.collection('owner_buildings').updateOne({ _id: b1._id }, { $push: { floors: floorId } });

      for (let rNum = 1; rNum <= 4; rNum++) {
        const roomNum = `${fNum}0${rNum}`;
        const roomRes = await db.collection('owner_rooms').insertOne({
          roomNumber: roomNum,
          roomType: rNum === 1 ? 'Single' : 'Double',
          capacity: rNum === 1 ? 1 : 2,
          rentAmount: rNum === 1 ? 15000 : 9000,
          floor: floorId,
          status: 'AVAILABLE'
        });
        const roomId = roomRes.insertedId;
        await db.collection('owner_floors').updateOne({ _id: floorId }, { $push: { rooms: roomId } });

        for (let bNum = 1; bNum <= (rNum === 1 ? 1 : 2); bNum++) {
          const bedRes = await db.collection('owner_beds').insertOne({
            bedNumber: `${roomNum}${String.fromCharCode(64 + bNum)}`,
            roomId: roomId,
            status: 'VACANT'
          });
          await db.collection('owner_rooms').updateOne({ _id: roomId }, { $push: { beds: bedRes.insertedId } });
        }
      }
    }

    // 4. CREATE TENANTS (Realistic)
    console.log('Seeding Tenants...');
    const allBeds = await db.collection('owner_beds').find({}).toArray();
    const tenantNames = ['Arjun Reddy', 'Sneha Kapoor', 'Vikram Singh', 'Priya Sharma', 'Rahul Verma', 'Ananya Iyer', 'Karthik Raja', 'Meera Nair'];
    const tenants = [];
    
    for (let i = 0; i < tenantNames.length; i++) {
      const bed = allBeds[i];
      const room = await db.collection('owner_rooms').findOne({ _id: bed.roomId });
      const floor = await db.collection('owner_floors').findOne({ _id: room.floor });
      
      const tenant = {
        name: tenantNames[i],
        email: `${tenantNames[i].toLowerCase().replace(' ', '.')}@example.com`,
        phone: `98765432${10 + i}`,
        emergencyContact: '9000000000',
        buildingId: b1._id,
        roomId: room._id,
        bedId: bed._id,
        rent: room.rentAmount,
        status: 'ACTIVE',
        checkInDate: new Date(2024, 0, i + 1),
        aadhaarNumber: `1234567890${10 + i}`
      };
      
      const res = await db.collection('owner_tenants').insertOne(tenant);
      tenants.push({ ...tenant, _id: res.insertedId });
      
      // Update bed status
      await db.collection('owner_beds').updateOne({ _id: bed._id }, { $set: { status: 'OCCUPIED' } });
    }

    // 5. PAYMENTS (3 Months History)
    console.log('Generating Payment History...');
    let invNum = 1001;
    for (const t of tenants) {
      for (let m = 0; m < 3; m++) {
        await db.collection('owner_payments').insertOne({
          tenantId: t._id,
          buildingId: t.buildingId,
          amount: t.rent,
          date: new Date(2024, m, 5),
          status: m === 2 ? 'Pending' : 'Paid',
          paymentMethod: 'UPI',
          transactionId: `TXN${Math.random().toString(36).toUpperCase().slice(2, 10)}`,
          invoice: `INV-2024-${invNum++}`
        });
      }
    }

    // 6. COMPLAINTS
    console.log('Seeding Complaints...');
    const issues = [
      { title: 'WiFi Speed Low', category: 'Maintenance', priority: 'Medium', status: 'Pending' },
      { title: 'AC Water Leakage', category: 'Maintenance', priority: 'High', status: 'In Progress' },
      { title: 'Food Quality Issue', category: 'Mess', priority: 'Medium', status: 'Resolved' }
    ];
    
    for (let i = 0; i < issues.length; i++) {
      await db.collection('owner_complaints').insertOne({
        ...issues[i],
        tenant: tenants[i]._id,
        buildingId: b1._id,
        createdAt: new Date()
      });
    }

    // 7. INVENTORY
    console.log('Seeding Inventory...');
    const items = [
      { name: 'Cots', category: 'Furniture', quantity: 50, unit: 'pcs' },
      { name: 'Mattresses', category: 'Bedding', quantity: 45, unit: 'pcs' },
      { name: 'WiFi Routers', category: 'Electronics', quantity: 12, unit: 'pcs' }
    ];
    for (const item of items) {
      await db.collection('owner_inventory').insertOne({ ...item, buildingId: b1._id });
    }

    // 8. MESS MENU
    console.log('Seeding Mess Menu...');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const day of days) {
      await db.collection('owner_messmenus').insertOne({
        day,
        buildingId: b1._id,
        breakfast: 'Poha & Jalebi',
        lunch: 'Dal Tadka, Rice, Mix Veg',
        dinner: 'Paneer Butter Masala, Roti'
      });
    }

    // 9. SETTINGS
    console.log('Seeding System Settings...');
    for (const b of buildings) {
      await db.collection('owner_systemsettings').insertOne({
        buildingId: b._id.toString(),
        owner: new mongoose.Types.ObjectId(OWNER_ID),
        generalSettings: { hostelName: b.name, ownerName: 'Property Owner' },
        rentSettings: { defaultRent: { single: 12000, double: 8000, shared: 6000 }, allowedPaymentMethods: ['UPI', 'Cash'] },
        roomConfig: { roomTypes: ['Single', 'Double', 'Triple'], bedTypes: ['Normal', 'Bunk'] }
      });
    }

    console.log('\n✅ MASTER DEMO SEED COMPLETE!');
    console.log(`Summary: 3 Buildings, 12 Rooms, 27 Beds, 8 Tenants, 24 Payments Created.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding Failed:', err);
    process.exit(1);
  }
}

seedDemo();
