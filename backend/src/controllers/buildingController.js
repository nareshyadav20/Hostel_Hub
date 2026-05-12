const Building = require('../models/Building');
const Floor = require('../models/Floor');
const Room = require('../models/Room');

const createBuilding = async (req, res) => {
  try {
    const { 
      name, address, locationCity, description, amenities, images, 
      startingPrice, genderType, category, rating, popularityLabel,
      policies, staffInfo, status, lastStep, draftData
    } = req.body;

    const building = await Building.create({ 
      name: name || 'Untitled Draft', 
      address, 
      locationCity: locationCity || 'Bengaluru',
      description, 
      amenities: amenities||[], 
      images: images||[],
      startingPrice: startingPrice || 5000,
      genderType: genderType || 'Mixed',
      category: category || 'Student',
      rating: rating || 4.5,
      popularityLabel,
      policies: policies || { smoking: 'Not Allowed', alcohol: 'Not Allowed', pets: 'No', visitors: 'Till 8 PM' },
      staffInfo,
      status: status || 'Active',
      lastStep: lastStep || 1,
      draftData,
      owner: req.user.id
    });
    res.status(201).json(building);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getBuildings = async (req, res) => {
  try {
    const query = { owner: req.user.id };
    if (req.query.status) {
      if (req.query.status === 'Active') {
        query.status = { $ne: 'Draft' };
      } else {
        query.status = req.query.status;
      }
    }
    console.log(`[DEBUG] getBuildings query:`, JSON.stringify(query));
    const buildings = await Building.find(query).populate({ 
      path: 'floors', 
      populate: { path: 'rooms', populate: { path: 'beds' } } 
    });
    console.log(`[DEBUG] Found ${buildings.length} buildings for owner ${req.user.id}`);
    res.status(200).json(buildings);
  } catch (error) { 
    console.error(`[DEBUG] getBuildings error:`, error);
    res.status(500).json({ error: error.message }); 
  }
};

const updateBuilding = async (req, res) => {
  try {
    const building = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!building) return res.status(404).json({ error: 'Building not found' });
    res.status(200).json(building);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteBuilding = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) return res.status(404).json({ error: 'Building not found' });
    if (building.floors && building.floors.length > 0)
      return res.status(400).json({ error: 'Cannot delete building with floors. Delete floors first.' });
    await Building.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Building deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const bulkCreateBuildings = async (req, res) => {
  try {
    const { buildings } = req.body;
    const createdBuildings = [];

    for (const bData of buildings) {
      const { name, address, description, floorsCount, acRoomsCount, nonAcRoomsCount, images } = bData;
      
      const building = new Building({ name, address, description, images: images || [] });
      await building.save();

      const numFloors = parseInt(floorsCount) || 0;
      const numAcRooms = parseInt(acRoomsCount) || 0;
      const numNonAcRooms = parseInt(nonAcRoomsCount) || 0;

      const createdFloors = [];

      for (let i = 1; i <= numFloors; i++) {
        const floor = new Floor({ floorNumber: String(i), buildingId: building._id });
        await floor.save();

        const createdRooms = [];
        let roomCounter = 1;

        for (let j = 0; j < numAcRooms; j++) {
          const roomNumStr = roomCounter < 10 ? `0${roomCounter}` : `${roomCounter}`;
          const room = new Room({
            roomNumber: `${i}${roomNumStr}-AC`,
            floor: floor._id,
            amenities: ['AC']
          });
          await room.save();
          createdRooms.push(room._id);
          roomCounter++;
        }

        for (let j = 0; j < numNonAcRooms; j++) {
          const roomNumStr = roomCounter < 10 ? `0${roomCounter}` : `${roomCounter}`;
          const room = new Room({
            roomNumber: `${i}${roomNumStr}-NonAC`,
            floor: floor._id,
            amenities: ['Non-AC']
          });
          await room.save();
          createdRooms.push(room._id);
          roomCounter++;
        }

        floor.rooms = createdRooms;
        await floor.save();
        createdFloors.push(floor._id);
      }

      building.floors = createdFloors;
      await building.save();
      
      createdBuildings.push(building);
    }

    res.status(201).json(createdBuildings);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

const getBuildingById = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id).populate({ path: 'floors', populate: { path: 'rooms', populate: { path: 'beds' } } });
    if (!building) return res.status(404).json({ error: 'Building not found' });
    res.status(200).json(building);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { createBuilding, getBuildings, getBuildingById, updateBuilding, deleteBuilding, bulkCreateBuildings };
