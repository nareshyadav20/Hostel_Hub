const axios = require('axios');

async function testAPI() {
  try {
    console.log("Attempting login...");
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@hostelhub.com',
      password: 'admin123'
    });

    const token = loginRes.data.token;
    console.log("Logged in successfully. Token acquired!");

    console.log("Fetching complaints from API...");
    const compRes = await axios.get('http://localhost:5000/api/complaints', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Successfully fetched ${compRes.data.length} complaints from endpoint!`);

    console.log("Fetching buildings from API...");
    const buildRes = await axios.get('http://localhost:5000/api/buildings', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Successfully fetched ${buildRes.data.length} buildings from endpoint!`);

    process.exit(0);
  } catch (err) {
    console.error("API Fetch Error:", err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

testAPI();
