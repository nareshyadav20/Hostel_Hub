const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

require('./src/models/Tenant');
require('./src/models/Building');
require('./src/models/MessAttendance');
require('./src/models/MessLog');

const messController = require('./src/controllers/messController');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB.');

    // SCENARIO 2: tenantId is undefined or missing
    console.log('Testing SCENARIO 2: tenantId is undefined');
    const req2 = {
      body: {
        tenantId: undefined, // missing tenantId
        buildingId: '6a01952478ca50d732febaae',
        date: '2026-05-18',
        meal: 'dinner',
        status: true
      }
    };

    const res2 = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        console.log('SCENARIO 2 RESPONSE JSON (Status Code:', this.statusCode || 200, ')');
        console.log(data);
      }
    };

    await messController.updateAttendance(req2, res2);

    process.exit(0);
  } catch (err) {
    console.error('🔥 CRITICAL RUNNER ERROR:', err);
    process.exit(1);
  }
};

run();
