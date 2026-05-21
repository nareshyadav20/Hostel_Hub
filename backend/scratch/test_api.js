const http = require('http');

http.get('http://localhost:5000/api/buildings/public', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (res.statusCode === 500) {
      console.log('Response:', data);
    } else {
      console.log('Response seems fine or not 500. Length:', data.length);
    }
  });
}).on('error', err => console.log('Error:', err.message));
