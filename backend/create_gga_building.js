const mongoose = require('mongoose');
const Building = require('./src/models/Building');
const Floor = require('./src/models/Floor');
const Room = require('./src/models/Room');
const Bed = require('./src/models/Bed');
const User = require('./src/models/User');

async function createGGABuilding() {
  try {
    await mongoose.connect('mongodb://hostel_admin:XMCpPZIZbne7NnNs@ac-ozmdn3w-shard-00-00.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-01.tdsqbc0.mongodb.net:27017,ac-ozmdn3w-shard-00-02.tdsqbc0.mongodb.net:27017/hostelhub?ssl=true&replicaSet=atlas-14n4zw-shard-0&authSource=admin&appName=hostelhub-db');
    
    const owner = await User.findOne({ role: 'OWNER' });
    if (!owner) {
      console.error("No OWNER found in DB!");
      process.exit(1);
    }
    
    console.log(`Creating GGA Building for owner: ${owner.email}`);
    
    // 1. Create Building
    const building = await Building.create({
      name: "GGA Elite Residency",
      address: "Gaddamadugu Heights, Road No. 36, Jubilee Hills, Hyderabad",
      locationCity: "Hyderabad",
      description: "A premium luxury hostel with state-of-the-art smart features and high-end amenities.",
      startingPrice: 15000,
      genderType: "Mixed",
      category: "Luxury",
      rating: 4.8,
      popularityLabel: "Most Popular",
      amenities: ["WiFi", "AC Rooms", "CCTV", "Gym", "Food Included", "Laundry", "Power Backup", "Biometric Access"],
      isAC: true,
      images: ["https://images.unsplash.com/photo-1555854817-5b2260d19dca?auto=format&fit=crop&q=80&w=800"],
      policies: {
        smoking: "Not Allowed",
        alcohol: "Not Allowed",
        visitors: "Till 9 PM",
        pets: "No"
      },
      staffInfo: {
        name: "Srinivas G.",
        role: "Chief Warden",
        contact: "+91 98765 43210"
      },
      smartConfig: {
        hasSmartAccess: true,
        hasClimateControl: true,
        hasAirQualityMonitor: true,
        hasAIHygiene: true,
        hasCCTVAi: true,
        targetComfortScore: 95
      },
      status: "Active",
      owner: owner._id
    });
    
    console.log(`Created Building: ${building.name} (${building._id})`);
    
    const floorIds = [];
    
    // 2. Create 3 Floors
    for (let f = 1; f <= 3; f++) {
      const floor = await Floor.create({
        floorNumber: `${f}`,
        description: `Floor ${f} - Premium Rooms`,
        building: building._id
      });
      floorIds.push(floor._id);
      
      const roomIds = [];
      
      // 3. Create 2 Rooms per floor
      for (let r = 1; r <= 2; r++) {
        const roomNumber = `${f}0${r}`;
        const room = await Room.create({
          roomNumber: roomNumber,
          roomType: r % 2 === 0 ? "Double" : "Single",
          floor: floor._id,
          buildingId: building._id,
          rentAmount: r % 2 === 0 ? 12000 : 15000,
          securityDeposit: 20000,
          isAC: true,
          status: "AVAILABLE",
          amenities: ["WiFi", "Attached Bathroom", "AC", "Study Table"]
        });
        roomIds.push(room._id);
        
        // 4. Create Beds for each room
        const numBeds = r % 2 === 0 ? 2 : 1;
        const bedIds = [];
        for (let b = 1; b <= numBeds; b++) {
          const bed = await Bed.create({
            bedNumber: `${roomNumber}${String.fromCharCode(64 + b)}`,
            room: room._id,
            buildingId: building._id,
            status: "AVAILABLE",
            price: room.rentAmount
          });
          bedIds.push(bed._id);
        }
        
        room.beds = bedIds;
        await room.save();
      }
      
      floor.rooms = roomIds;
      await floor.save();
    }
    
    building.floors = floorIds;
    await building.save();
    
    console.log("GGA Building and all child records (Floors, Rooms, Beds) created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating GGA building:", err);
    process.exit(1);
  }
}

createGGABuilding();
