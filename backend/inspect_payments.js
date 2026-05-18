const mongoose = require('mongoose');
require('c:/Users/Dell/Hostel_Hub/Hostel_Hub/backend/src/config/db')().then(async () => {
  const Payment = require('c:/Users/Dell/Hostel_Hub/Hostel_Hub/backend/src/models/Payment');
  const ps = await Payment.find({
    $or: [
      { buildingId: '6a06e19188ab1e134078be08' },
      { buildingId: new mongoose.Types.ObjectId('6a06e19188ab1e134078be08') }
    ]
  });
  console.log('Payments Count:', ps.length);
  console.log(ps.map(p => ({ amount: p.amount, status: p.status, date: p.date })));
  mongoose.disconnect();
});
