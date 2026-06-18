const axios = require('axios');
const API_URL = 'http://localhost:5000/api/v1';

async function runTest() {
  console.log('--- Starting E2E Validation Script ---');
  let token = '';
  
  // 1. Authenticate as an owner
  try {
    console.log('1. Registering/Logging in Test Owner...');
    // We try to login first
    let res = await axios.post(`${API_URL}/auth/login`, {
      email: 'e2e_test@example.com',
      password: 'password123'
    }).catch(() => null);

    if (!res) {
      res = await axios.post(`${API_URL}/auth/register`, {
        name: 'E2E Tester',
        email: 'e2e_test@example.com',
        password: 'password123',
        phone: '9999999999',
        role: 'owner'
      });
    }
    token = res.data.token;
    console.log('✅ Authentication successful');
  } catch (error) {
    console.error('❌ Authentication failed:', error.response?.data || error.message);
    return;
  }

  const reqConfig = { headers: { Authorization: `Bearer ${token}` } };

  try {
    // 2. Create Building (Property Level)
    console.log('\n2. Testing Property & Building Creation...');
    let buildingPayload = {
      name: 'E2E Test Property',
      description: 'A beautiful test property',
      address: '123 Test Ave',
      locationCity: 'Bengaluru',
      genderType: 'Mixed',
      security: true, cctv: true, parking: false, powerBackup: true,
      mess: true, gym: false, library: true, laundry: true, housekeeping: true, medicalSupport: false,
      lift: true, wifi: true, diningHall: true, commonKitchen: false, studyHall: true,
      laundryRoom: true, fireSafety: true, emergencyExit: true,
      rentSingle: 10000, rentDouble: 8000, rentTriple: 6000, rent4Sharing: 5000, rent5Sharing: 4000, rent6Sharing: 3000,
      securityDeposit: 5000,
      staffInfo: { name: 'Warden John', role: 'Warden', contact: '1234567890' },
      images: ['img1.jpg'], documents: ['doc1.pdf']
    };
    
    let bRes = await axios.post(`${API_URL}/buildings`, buildingPayload, reqConfig);
    let bId = bRes.data._id || bRes.data.id;
    console.log(`✅ Building Created. ID: ${bId}`);
    
    // Validate Building fields
    let building = bRes.data;
    const bCheck = (building.security === true && building.wifi === true && building.rentSingle === 10000 && building.staffInfo.name === 'Warden John');
    console.log(bCheck ? '✅ Building payload mapping verified' : '❌ Building payload mapping failed');
    
    console.log('\nTesting Building Update...');
    buildingPayload.wifi = false;
    bRes = await axios.patch(`${API_URL}/buildings/${bId}`, buildingPayload, reqConfig);
    console.log(bRes.data.wifi === false ? '✅ Building update mapping verified' : '❌ Building update mapping failed');

    // 3. Create Floor
    console.log('\n3. Testing Floor Creation...');
    let floorPayload = {
      buildingId: bId,
      floorNumber: '1',
      commonWashroom: 2,
      waterPoint: 1,
      washingMachine: 1,
      fridge: 1,
      studyArea: true,
      loungeArea: false,
      balcony: true,
      waitingArea: false
    };
    let fRes = await axios.post(`${API_URL}/floors`, floorPayload, reqConfig);
    let fId = fRes.data._id || fRes.data.id;
    console.log(`✅ Floor Created. ID: ${fId}`);

    let floor = fRes.data;
    const fCheck = (floor.commonWashroom === 2 && floor.studyArea === true && floor.loungeArea === false);
    console.log(fCheck ? '✅ Floor payload mapping verified' : '❌ Floor payload mapping failed');

    // 4. Create Room
    console.log('\n4. Testing Room Creation...');
    let roomPayload = {
      floorId: fId,
      roomNumber: '101',
      capacity: 2,
      roomSize: '12x14',
      isAC: true,
      attachedBathroom: true,
      balcony: true,
      fanCount: 2,
      chairCount: 2,
      geyser: true,
      studyTable: true,
      wardrobe: true,
      mirror: true,
      tv: false,
      refrigerator: false,
      microwave: false,
      wifi: true,
      images: ['room1.jpg']
    };
    let rRes = await axios.post(`${API_URL}/rooms`, roomPayload, reqConfig);
    let rId = rRes.data._id || rRes.data.id;
    console.log(`✅ Room Created. ID: ${rId}`);

    let room = rRes.data;
    const rCheck = (room.isAC === true && room.geyser === true && room.fanCount === 2 && room.tv === false);
    console.log(rCheck ? '✅ Room payload mapping verified' : '❌ Room payload mapping failed');

    // 5. Create Bed
    console.log('\n5. Testing Bed Creation & Occupant Statuses...');
    let bedPayload = {
      roomId: rId,
      bedNumber: '101-A',
      bedSize: 'Single',
      bedFacing: 'Window',
      status: 'Occupied',
      mattress: true,
      pillow: true,
      locker: true,
      readingLamp: true,
      chargingPoint: true,
      occupantDetails: {
        tenantName: 'Alice Smith',
        joinDate: '2026-06-01',
        exitDate: '2027-05-31'
      }
    };
    let bedRes = await axios.post(`${API_URL}/beds`, bedPayload, reqConfig);
    let bedId = bedRes.data._id || bedRes.data.id;
    console.log(`✅ Bed Created. ID: ${bedId}`);

    let bed = bedRes.data;
    const bedCheck = (bed.mattress === true && bed.status === 'Occupied' && bed.occupantDetails?.tenantName === 'Alice Smith');
    console.log(bedCheck ? '✅ Bed payload & Occupant mapping verified' : '❌ Bed payload mapping failed');
    if (!bedCheck) console.dir(bed);

    // Update Bed to Vacant
    console.log('Testing Bed Occupant update to Vacant...');
    bedPayload.status = 'Vacant';
    bedPayload.occupantDetails = undefined;
    bedRes = await axios.patch(`${API_URL}/beds/${bedId}`, { status: 'Vacant', occupantDetails: null }, reqConfig);
    console.log(bedRes.data.status === 'Vacant' ? '✅ Bed status changed to Vacant' : '❌ Bed status change failed');

    // 6. Delete Propagation
    console.log('\n6. Testing Delete & Cascade propagation...');
    await axios.delete(`${API_URL}/buildings/${bId}`, reqConfig);
    console.log(`✅ Building Deleted. ID: ${bId}`);

    // Verify
    let floorStillExists = await axios.get(`${API_URL}/floors/${fId}`, reqConfig).catch(() => null);
    console.log(!floorStillExists ? '✅ Floors cascadingly deleted successfully' : '❌ Floors were orphaned!');

  } catch (err) {
    console.error('❌ Test Failed:', err.response?.data || err.message);
  }
}

runTest();
