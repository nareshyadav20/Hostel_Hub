const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

// Register models
require('./src/models/Building');
require('./src/models/Tenant');
require('./src/models/Room');
require('./src/models/Complaint');

const assetController = require('./src/controllers/assetController');

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const mockReq = {
      user: { id: '69f5d174bb94a186e2747924' }, // panganareshyadav24@gmail.com
      query: { buildingId: 'all' }
    };

    const mockRes = {
      status: (code) => {
        console.log('HTTP Status:', code);
        return {
          json: (data) => {
            console.log('=== KPI STATS ===');
            console.log({
              totalAssets: data.totalAssets,
              activeIssues: data.activeIssues,
              resolvedIssues: data.resolvedIssues,
              highFrequencyAssets: data.highFrequencyAssets
            });
            console.log('=== COMPLAINTS SAMPLE ===');
            if (data.complaints && data.complaints.length > 0) {
              console.log(JSON.stringify(data.complaints.slice(0, 2), null, 2));
            } else {
              console.log('No asset complaints found.');
            }
          }
        };
      }
    };

    await assetController.getAssetSummary(mockReq, mockRes);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
test();
