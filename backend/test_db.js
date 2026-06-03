const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/hostel_hub").then(async () => {
  const Room = require("./src/models/Room.js");
  const Floor = require("./src/models/Floor.js");
  const bId = "6a12690e6f227214775cd0cb";
  const floors = await Floor.find({ building: bId });
  console.log("Floors for building:", floors.length);
  for (const f of floors) {
    const rooms = await Room.find({ floor: f._id });
    console.log("Floor ID:", f._id, "Rooms:", rooms.length);
  }
  process.exit(0);
});
