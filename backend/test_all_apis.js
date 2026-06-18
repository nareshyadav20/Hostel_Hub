require('dotenv').config();
const http = require('http');
const jwt = require('jsonwebtoken');

// Generate a valid mock token for testing protected routes
const MOCK_USER_ID = "60d0fe4f5311236168a109ca"; 
const MOCK_EMAIL = "testuser_automated@example.com";
// If JWT_SECRET isn't in env (e.g. not loaded right), fallback to a typical default or it will fail
const secret = process.env.JWT_SECRET || 'fallback_secret_if_none';
const token = jwt.sign({ id: MOCK_USER_ID, email: MOCK_EMAIL, role: 'TENANT' }, secret, { expiresIn: '1h' });

const request = (method, path, body = null, useAuth = false) => {
  return new Promise((resolve) => {
    const headers = { 'Content-Type': 'application/json' };
    if (useAuth) headers['Authorization'] = `Bearer ${token}`;
    if (body) headers['Content-Length'] = Buffer.byteLength(body);

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });

    req.on('error', (e) => resolve({ status: 500, data: e.message }));
    if (body) req.write(body);
    req.end();
  });
};

async function runAllTests() {
  console.log("🚀 Starting Automated API Tests (Local)...");
  
  // 1. AUTH & PROFILE
  console.log("\n--- 1. Authentication & Profile ---");
  const refreshRes = await request('POST', '/api/auth/refresh', JSON.stringify({ refreshToken: token }));
  console.log(`[POST /api/auth/refresh] -> Status: ${refreshRes.status}`);

  const profileRes = await request('PATCH', '/api/profile', JSON.stringify({ name: "Automated Tester" }), true);
  console.log(`[PATCH /api/profile] -> Status: ${profileRes.status} (Protected)`);
  // Note: 404 is expected here if the mock user doesn't actually exist in the DB, but 404 proves auth worked (didn't get 401)

  // Forgot password flow
  const forgotRes = await request('POST', '/api/auth/forgot-password', JSON.stringify({ email: MOCK_EMAIL }));
  console.log(`[POST /api/auth/forgot-password] -> Status: ${forgotRes.status}`);
  let otp = null;
  try { otp = JSON.parse(forgotRes.data).devOtp; } catch(e) {}
  
  if (otp) {
     const verifyRes = await request('POST', '/api/auth/verify-otp', JSON.stringify({ email: MOCK_EMAIL, otp }));
     console.log(`[POST /api/auth/verify-otp] -> Status: ${verifyRes.status}`);
  }

  // 2. HOSTELS
  console.log("\n--- 2. Hostels ---");
  const hostelsListRes = await request('GET', '/api/hostels?limit=1');
  console.log(`[GET /api/hostels] -> Status: ${hostelsListRes.status} | Data snippet: ${hostelsListRes.data.substring(0, 50)}...`);
  
  const hostelDetailRes = await request('GET', '/api/hostels/6a265442d2fbe54d2c5d67a0'); // Using a dummy ID
  console.log(`[GET /api/hostels/:id] -> Status: ${hostelDetailRes.status} (Returns 400/404 if ID is invalid format, but proves route exists)`);

  // 3. ROOM TRANSFERS
  console.log("\n--- 3. Room Transfers ---");
  const createTransferRes = await request('POST', '/api/room-transfer', JSON.stringify({ newRoom: "101", reason: "Test" }), true);
  console.log(`[POST /api/room-transfer] -> Status: ${createTransferRes.status} (Protected)`);

  const singleTransferRes = await request('GET', '/api/room-transfer/6a265442d2fbe54d2c5d67a0', null, true);
  console.log(`[GET /api/room-transfer/:id] -> Status: ${singleTransferRes.status} (Protected)`);

  const cancelTransferRes = await request('DELETE', '/api/room-transfer/6a265442d2fbe54d2c5d67a0', null, true);
  console.log(`[DELETE /api/room-transfer/:id] -> Status: ${cancelTransferRes.status} (Protected)`);

  // 4. REWARDS
  console.log("\n--- 4. Rewards ---");
  const rewardsRes = await request('GET', '/api/rewards/me', null, true);
  console.log(`[GET /api/rewards/me] -> Status: ${rewardsRes.status} (Protected)`);

  // 5. MESS
  console.log("\n--- 5. Mess Services ---");
  const messMenuRes = await request('GET', '/api/mess/menu?buildingId=6a265442d2fbe54d2c5d67a0', null, true);
  console.log(`[GET /api/mess/menu] -> Status: ${messMenuRes.status} (Protected)`);

  const messAttendanceRes = await request('PUT', '/api/mess/attendance', JSON.stringify({
      buildingId: "6a265442d2fbe54d2c5d67a0",
      date: "2026-06-17",
      meal: "lunch",
      status: true
  }), true);
  console.log(`[PUT /api/mess/attendance] -> Status: ${messAttendanceRes.status} (Protected)`);

  console.log("\n✅ All tests executed. If routes return 200/201, they worked fully.");
  console.log("✅ If routes return 400/404, the route exists and auth passed, but the dummy test data (like fake ObjectIDs) wasn't found in DB.");
  console.log("❌ If routes return 401, authentication failed. If 404s appear for routes that don't need IDs, the route is missing.");
}

runAllTests();
