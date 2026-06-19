const axios = require('axios');
async function test() {
  try {
    const listRes = await axios.get('http://localhost:5000/api/buildings/public?limit=1');
    console.log("Listing API Response:");
    console.log(JSON.stringify(listRes.data, null, 2));

    if (listRes.data.data && listRes.data.data.length > 0) {
      const id = listRes.data.data[0]._id;
      const detailRes = await axios.get(`http://localhost:5000/api/buildings/public/${id}`);
      console.log("\nDetail API Response:");
      console.log(JSON.stringify(detailRes.data, null, 2));
    }
  } catch (e) {
    console.error("Error:", e.response ? e.response.data : e.message);
  }
}
test();
