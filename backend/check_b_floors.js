const axios = require('axios');
async function check() {
  const res = await axios.get('http://localhost:5000/api/buildings/public');
  const bWithFloors = res.data.filter(b => b.totalFloors > 0);
  console.log("Buildings with floors:", bWithFloors.length);
  if (bWithFloors.length > 0) {
    console.log("Sample:", JSON.stringify(bWithFloors[0], null, 2));
  }
}
check();
