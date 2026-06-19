const axios = require('axios');
async function test() {
  try {
    const listRes = await axios.get('http://localhost:5000/api/buildings/public?search=royal');
    console.log("Search 'royal' Response:", listRes.data.count);
    const listRes2 = await axios.get('http://localhost:5000/api/buildings/public?search=bangloure');
    console.log("Search 'bangloure' Response:", listRes2.data.count);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
