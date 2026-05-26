const axios = require('axios');

async function testPerformance() {
  const baseURL = 'http://localhost:5000/api';
  const credentials = {
    email: 'panganareshyadav24@gmail.com',
    password: '1234'
  };

  try {
    console.log('--- PERFORMANCE TEST START ---');
    console.log('1. Testing Login...');
    console.time('Login Time');
    const loginRes = await axios.post(`${baseURL}/auth/login`, credentials);
    console.timeEnd('Login Time');
    
    const token = loginRes.data.token;
    if (!token) throw new Error('No token received');
    console.log(`✅ Logged in successfully as: ${loginRes.data.user.name} (${loginRes.data.user.role})`);

    const headers = { Authorization: `Bearer ${token}` };

    console.log('\n2. Testing Buildings List Fetch (Optimized with .lean() and no nested populate)...');
    console.time('Fetch Buildings');
    const buildingsRes = await axios.get(`${baseURL}/buildings`, { headers });
    console.timeEnd('Fetch Buildings');
    console.log(`✅ Fetched ${buildingsRes.data.length} buildings.`);
    const payloadSize = JSON.stringify(buildingsRes.data).length;
    console.log(`📦 Uncompressed Payload Size: ${(payloadSize / 1024).toFixed(2)} KB`);

    console.log('\n3. Testing Dashboard Summary Fetch (Optimized with 60s node-cache)...');
    console.time('Fetch Dashboard Summary (1st hit - DB calculation)');
    await axios.get(`${baseURL}/dashboard/summary`, { headers });
    console.timeEnd('Fetch Dashboard Summary (1st hit - DB calculation)');

    console.time('Fetch Dashboard Summary (2nd hit - Cached)');
    await axios.get(`${baseURL}/dashboard/summary`, { headers });
    console.timeEnd('Fetch Dashboard Summary (2nd hit - Cached)');

    console.log('\n--- PERFORMANCE TEST COMPLETE ---');
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

testPerformance();
