const axios = require('axios');

async function testNested() {
  try {
    const res = await axios.get('http://localhost:5000/api/buildings/public');
    console.log(`Status: ${res.status}`);
    console.log(`Returned buildings: ${res.data.length}`);
    if (res.data.length > 0) {
      console.log('Sample Building:', JSON.stringify(res.data[0], null, 2));
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

testNested();
