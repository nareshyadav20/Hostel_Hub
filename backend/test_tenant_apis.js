const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
let token = '';

const PUBLIC_APIS = [
  { method: 'GET', url: '/api/buildings/public' },
  { method: 'GET', url: '/api/rooms/public' },
  { method: 'GET', url: '/api/floors/public' },
  { method: 'GET', url: '/api/amenities/public' },
  { method: 'GET', url: '/api/hostels/public' }
];

const PROTECTED_APIS = [
  { method: 'GET', url: '/api/profile' },
  { method: 'GET', url: '/api/tenants' },
  { method: 'GET', url: '/api/bookings' },
  { method: 'GET', url: '/api/payments' },
  { method: 'GET', url: '/api/complaints' },
  { method: 'GET', url: '/api/notifications' },
  { method: 'GET', url: '/api/wishlist' },
  { method: 'GET', url: '/api/reviews' },
  { method: 'GET', url: '/api/dashboard/summary' } // Testing a real dashboard route
];

async function authenticate() {
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/register`, {
      email: `test_${Date.now()}@test.com`,
      password: 'password123',
      name: 'Test Tenant',
      role: 'TENANT',
      phone: '+919876543210'
    });
    token = res.data.token;
    console.log("✅ Authenticated successfully. Token obtained.");
  } catch (err) {
    if (err.response && err.response.status === 400) {
      // User already exists, try login
      const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: `test_tenant@test.com`,
        password: 'password123'
      }).catch(e => console.log('Login failed', e.message));
      if (loginRes && loginRes.data) token = loginRes.data.token;
    } else {
      console.error("❌ Authentication failed", err.message);
    }
  }
}

async function testApis(apis, requireAuth = false) {
  for (const api of apis) {
    console.log(`\n========================================`);
    console.log(`Testing: ${api.method} ${api.url}`);
    
    const headers = requireAuth && token ? { 'Authorization': `Bearer ${token}` } : {};
    
    try {
      const start = Date.now();
      const res = await axios({
        method: api.method,
        url: `${BASE_URL}${api.url}`,
        headers
      });
      const end = Date.now();
      
      console.log(`Status: ${res.status} ✅`);
      console.log(`Time: ${end - start}ms`);
      
      let dataCount = 0;
      if (Array.isArray(res.data)) dataCount = res.data.length;
      else if (res.data && Array.isArray(res.data.data)) dataCount = res.data.data.length;
      else if (res.data) dataCount = 1;
      
      console.log(`Response Count: ${dataCount}`);
    } catch (err) {
      console.log(`Status: ${err.response ? err.response.status : 'Network Error'} ❌`);
      if (err.response) {
        console.log(`Error Response:`, err.response.data);
      } else {
        console.log(`Message:`, err.message);
      }
    }
  }
}

async function run() {
  console.log("🚀 Starting API Tests...\n");
  
  console.log("--- PUBLIC APIs ---");
  await testApis(PUBLIC_APIS, false);
  
  console.log("\n--- AUTHENTICATING ---");
  await authenticate();
  
  if (token) {
    console.log("\n--- PROTECTED APIs ---");
    await testApis(PROTECTED_APIS, true);
  }
  
  console.log("\n--- AUTH OTP TEST ---");
  try {
    const otpRes = await axios.post(`${BASE_URL}/api/auth/send-otp`, { phone: '+919876543210' });
    console.log('send-otp Status:', otpRes.status);
    console.log('send-otp Response:', otpRes.data);
    
    if (otpRes.data.devOtp) {
       const verifyRes = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { phone: '+919876543210', otp: otpRes.data.devOtp });
       console.log('verify-otp Status:', verifyRes.status);
    }
  } catch(e) {
    console.log('OTP Test Failed:', e.response ? e.response.status : e.message);
  }
  
  console.log("\n✅ Testing Complete.");
}

run();
