const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/hostel_hub").then(async () => {
  const Floor = require("./src/models/Floor.js");
  const Room = require("./src/models/Room.js");
  const Bed = require("./src/models/Bed.js");
  
  const floors = await mongoose.connection.db.collection("floors").find({}).toArray();
  for (const f of floors) {
    if (f.buildingId && !f.building) {
      await mongoose.connection.db.collection("floors").updateOne({ _id: f._id }, { $set: { building: f.buildingId } });
    }
  }
  
  const rooms = await mongoose.connection.db.collection("rooms").find({}).toArray();
  for (const r of rooms) {
    if (r.floorId && !r.floor) {
      await mongoose.connection.db.collection("rooms").updateOne({ _id: r._id }, { $set: { floor: r.floorId } });
    }
  }

  const beds = await mongoose.connection.db.collection("beds").find({}).toArray();
  for (const b of beds) {
    if (b.roomId && !b.room) {
      await mongoose.connection.db.collection("beds").updateOne({ _id: b._id }, { $set: { room: b.roomId } });
    }
  }
  console.log("Database schema keys fixed!");
  process.exit(0);
});
