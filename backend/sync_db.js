const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/hostel_hub").then(async () => {
  const db = mongoose.connection.db;

  const buildings = await db.collection("buildings").find({}).toArray();
  for (const b of buildings) {
    if (b.floors && b.floors.length > 0) {
      for (const fId of b.floors) {
        await db.collection("floors").updateOne({ _id: fId }, { $set: { building: b._id } });
      }
    }
  }

  const floors = await db.collection("floors").find({}).toArray();
  for (const f of floors) {
    if (f.rooms && f.rooms.length > 0) {
      for (const rId of f.rooms) {
        await db.collection("rooms").updateOne({ _id: rId }, { $set: { floor: f._id } });
      }
    }
  }

  const rooms = await db.collection("rooms").find({}).toArray();
  for (const r of rooms) {
    if (r.beds && r.beds.length > 0) {
      for (const bId of r.beds) {
        await db.collection("beds").updateOne({ _id: bId }, { $set: { room: r._id } });
      }
    }
  }
  
  console.log("DB sync complete!");
  process.exit(0);
});
