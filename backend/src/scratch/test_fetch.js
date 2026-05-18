const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Notification = mongoose.model('Notification', new mongoose.Schema({}, { strict: false }));
  const Building = mongoose.model('Building', new mongoose.Schema({}, { strict: false }));
  
  let out = '';
  const log = (msg) => { out += msg + '\n'; console.log(msg); };

  const ownerId = '69f5d174bb94a186e2747924';
  const buildings = await Building.find({ owner: ownerId });
  log('🏢 OWNER BUILDINGS: ' + JSON.stringify(buildings.map(b => ({ id: b._id.toString(), name: b.name })), null, 2));
  
  const buildingId = '6a06e19188ab1e134078be08';
  const filters = { archived: false };
  const bIdStr = buildingId.toString();
  
  filters.$and = [{
    $or: [
      { buildingId: bIdStr },
      { buildingId: mongoose.Types.ObjectId.isValid(bIdStr) ? new mongoose.Types.ObjectId(bIdStr) : null },
      { buildingId: { $exists: false } },
      { buildingId: null }
    ]
  }];
  
  filters.$or = [
    { portalType: 'Owner' },
    { buildingId: bIdStr },
    { buildingId: mongoose.Types.ObjectId.isValid(bIdStr) ? new mongoose.Types.ObjectId(bIdStr) : null }
  ];
  
  log('📝 QUERY FILTER: ' + JSON.stringify(filters, null, 2));
  
  const notifs = await Notification.find(filters).sort({ createdAt: -1 });
  log('Original filters - FOUND NOTIFICATIONS COUNT: ' + notifs.length);
  notifs.slice(0, 10).forEach(n => log(` -> ${n.title} | module: ${n.moduleName} | portal: ${n.portalType} | buildingId: ${n.buildingId}`));
  
  // Let's also check all notifications with moduleName: Mess
  const messNotifs = await Notification.find({ moduleName: 'Mess' }).sort({ createdAt: -1 });
  log('All Mess Notifications count: ' + messNotifs.length);
  messNotifs.slice(0, 10).forEach(n => log(` -> ${n.title} | portal: ${n.portalType} | buildingId: ${n.buildingId} | archived: ${n.archived}`));
  
  fs.writeFileSync('src/scratch/test_fetch_output.txt', out);
  process.exit();
}).catch(e => {
  console.error(e);
  process.exit(1);
});
