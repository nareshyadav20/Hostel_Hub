const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

const endpoints = [
  '/api/v1/hostels',
  '/api/v1/hostels/60d21b4667d0d8992e610c85', // dummy id
  '/api/v1/hostels?location=Hyderabad',
  '/api/v1/hostels?gender=MALE',
  '/api/v1/hostels?gender=FEMALE',
  '/api/v1/hostels?rating=4',
  '/api/v1/hostels?minPrice=5000&maxPrice=10000',
  '/api/v1/hostels?sortBy=price&order=asc',
  '/api/v1/hostels?sortBy=price&order=desc',
  '/api/v1/hostels?sortBy=rating&order=desc',
  '/api/v1/hostels?page=1&limit=10',
  '/api/v1/hostels?location=Hyderabad&gender=MALE&rating=4&minPrice=5000&maxPrice=10000&sortBy=price&order=asc&page=1&limit=10'
];

async function testAll() {
  console.log("--- STARTING API TESTS ---");
  for (const ep of endpoints) {
    try {
      const url = `${BASE_URL}${ep}`;
      console.log(`\nTesting API: ${ep}`);
      console.log(`Request URL: ${url}`);
      
      const response = await axios.get(url);
      
      console.log(`Total records found: ${response.data.totalHostels !== undefined ? response.data.totalHostels : (response.data.data ? response.data.data.length : 'N/A')}`);
      console.log(`Response summary:`, JSON.stringify(response.data).substring(0, 150) + "...");
      
    } catch (error) {
      console.log(`Error calling ${ep}: ${error.response ? error.response.status : error.message}`);
      if (error.response && error.response.data) {
        console.log(`Error data:`, error.response.data);
      }
    }
  }
  console.log("\n--- END OF API TESTS ---");
}

testAll();
