const Building = require('../models/Building');
const Floor = require('../models/Floor');
const Room = require('../models/Room');
const Bed = require('../models/Bed');
const Tenant = require('../models/Tenant');
const BuildingPhoto = require('../models/BuildingPhoto');

const createBuilding = async (req, res) => {
  try {
    const {
      name, address, locationCity, description, amenities, images,
      startingPrice, securityDeposit, maintenanceCharges, foodCharges,
      rentSingle, rentDouble, rentTriple, totalRooms, totalBeds,
      genderType, category, rating, popularityLabel,
      policies, staffInfo, status, lastStep, draftData, showInPortfolio,
      propertyId
    } = req.body;

    const parseField = (field, defaultValue) => {
      if (!field) return defaultValue;
      if (typeof field === 'object') return field;
      try {
        return JSON.parse(field);
      } catch (e) {
        if (typeof field === 'string' && defaultValue && Array.isArray(defaultValue)) {
          if (field.includes(',')) {
            return field.split(',').map(s => s.trim());
          }
          return [field];
        }
        return field || defaultValue;
      }
    };

    let finalImages = parseField(images, []);
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(file => {
        const b64 = file.buffer.toString('base64');
        return `data:${file.mimetype};base64,${b64}`;
      });
      finalImages.push(...uploadedImages);
    }

    const finalAmenities = parseField(amenities, []);
    const finalPolicies = parseField(policies, { smoking: 'Not Allowed', alcohol: 'Not Allowed', pets: 'No', visitors: 'Till 8 PM' });
    const finalStaffInfo = parseField(staffInfo, undefined);
    const finalDraftData = parseField(draftData, undefined);

    const building = await Building.create({
      name: name || 'Untitled Draft',
      address,
      locationCity: locationCity || 'Bengaluru',
      description,
      amenities: finalAmenities,
      images: finalImages,
      startingPrice: startingPrice || 5000,
      securityDeposit: securityDeposit || 0,
      maintenanceCharges: maintenanceCharges || 799,
      foodCharges: foodCharges || 3000,
      rentSingle,
      rentDouble,
      rentTriple,
      totalRooms: totalRooms || 0,
      totalBeds: totalBeds || 0,
      genderType: genderType || 'Mixed',
      category: category || 'Student',
      rating: rating || 4.5,
      popularityLabel,
      policies: finalPolicies,
      staffInfo: finalStaffInfo,
      status: status || 'Active',
      lastStep: lastStep || 1,
      draftData: finalDraftData,
      showInPortfolio: showInPortfolio !== undefined ? showInPortfolio : true,
      propertyId: propertyId || null,
      owner: req.user.id
    });

    // Sync photos to BuildingPhoto collection
    if (finalImages && finalImages.length > 0) {
      const photoDocs = finalImages.map(url => ({
        buildingId: building._id,
        photoUrl: url
      }));
      await BuildingPhoto.insertMany(photoDocs).catch(err => {
        console.warn('[DEBUG] BuildingPhoto sync warning:', err.message);
      });
    }

    res.status(201).json(building);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getBuildings = async (req, res) => {
  try {
    const isPlatformAdmin = req.user && req.user.role && ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role.toUpperCase());
    const query = isPlatformAdmin ? {} : { owner: req.user.id };
    if (req.query.status) {
      if (req.query.status === 'Active') {
        query.status = { $ne: 'Draft' };
      } else {
        query.status = req.query.status;
      }
    }
    if (req.query.propertyId) {
      query.$or = [
        { _id: req.query.propertyId },
        { propertyId: req.query.propertyId }
      ];
    } else {
      query.propertyId = { $in: [null, undefined] };
      query.showInPortfolio = { $ne: false };
    }
    console.log(`[DEBUG] getBuildings query:`, JSON.stringify(query));
    const buildings = await Building.find(query)
      .select('-floors -images -draftData -gallery -description')
      .lean();

    const populatedBuildings = await Promise.all(buildings.map(async (building) => {
      const floorDocs = await Floor.find({ building: building._id });
      const floorIds = floorDocs.map(f => f._id);
      
      const rooms = await Room.find({ floor: { $in: floorIds } }).populate('beds');
      
      let totalBeds = 0;
      let occupiedBeds = 0;
      
      rooms.forEach(room => {
        const beds = room.beds || [];
        totalBeds += beds.length;
        occupiedBeds += beds.filter(b => b.status === 'OCCUPIED' || b.status === 'Occupied').length;
      });
      
      building.totalRooms = rooms.length;
      building.totalBeds = totalBeds;
      building.occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
      
      return building;
    }));

    console.log(`[DEBUG] Found ${populatedBuildings.length} buildings for owner ${req.user.id}`);
    res.status(200).json(populatedBuildings);
  } catch (error) {
    console.error(`[DEBUG] getBuildings error:`, error);
    res.status(500).json({ error: error.message });
  }
};

const updateBuilding = async (req, res) => {
  try {
    const updateData = { ...req.body };

    const parseField = (field, defaultValue) => {
      if (!field) return defaultValue;
      if (typeof field === 'object') return field;
      try {
        return JSON.parse(field);
      } catch (e) {
        if (typeof field === 'string' && defaultValue && Array.isArray(defaultValue)) {
          if (field.includes(',')) {
            return field.split(',').map(s => s.trim());
          }
          return [field];
        }
        return field || defaultValue;
      }
    };

    if (updateData.amenities) {
      updateData.amenities = parseField(updateData.amenities, []);
    }
    if (updateData.policies) {
      updateData.policies = parseField(updateData.policies, {});
    }
    if (updateData.staffInfo) {
      updateData.staffInfo = parseField(updateData.staffInfo, {});
    }
    if (updateData.draftData) {
      updateData.draftData = parseField(updateData.draftData, {});
    }

    let finalImages = parseField(updateData.images, []);
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(file => {
        const b64 = file.buffer.toString('base64');
        return `data:${file.mimetype};base64,${b64}`;
      });
      finalImages.push(...uploadedImages);
    }
    if (updateData.images || (req.files && req.files.length > 0)) {
      updateData.images = finalImages;
    }

    const building = await Building.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!building) return res.status(404).json({ error: 'Building not found' });

    // Sync new photos to BuildingPhoto collection
    if (building.images && Array.isArray(building.images)) {
      for (const url of building.images) {
        const exists = await BuildingPhoto.findOne({ buildingId: building._id, photoUrl: url });
        if (!exists) {
          await BuildingPhoto.create({ buildingId: building._id, photoUrl: url }).catch(err => {
            console.warn('[DEBUG] BuildingPhoto creation warning:', err.message);
          });
        }
      }
    }

    // Real-time synchronization
    const socketService = require('../utils/socketService');
    socketService.emitUpdate(building._id, 'hostelUpdated', building);
    socketService.emitUpdate(null, 'hostelUpdated', building); // Emit globally for landing/search pages

    res.status(200).json(building);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteBuilding = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) return res.status(404).json({ error: 'Building not found' });

    // Perform Cascade Delete
    // 1. Find all floors in this building
    const floors = await Floor.find({ building: req.params.id });
    const floorIds = floors.map(f => f._id);

    // 2. Find all rooms in these floors
    const rooms = await Room.find({ floor: { $in: floorIds } });
    const roomIds = rooms.map(r => r._id);

    // 3. Delete all beds in these rooms
    await Bed.deleteMany({ room: { $in: roomIds } });

    // 4. Delete all rooms
    await Room.deleteMany({ floor: { $in: floorIds } });

    // 5. Delete all floors
    await Floor.deleteMany({ building: req.params.id });

    // 6. Delete or update tenants associated with this building
    await Tenant.deleteMany({ buildingId: req.params.id });

    // 7. Finally delete the building itself
    await Building.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Building and all associated infrastructure deleted successfully' });
  } catch (error) {
    console.error(`[ERROR] deleteBuilding:`, error);
    res.status(500).json({ error: error.message });
  }
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
        const floor = new Floor({ floorNumber: String(i), building: building._id });
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
    const building = await Building.findById(req.params.id);
    if (!building) return res.status(404).json({ error: 'Building not found' });

    const bObj = building.toObject();

    // Query floors directly for the building and its sub-buildings
    const subBuildings = await Building.find({ propertyId: building._id }).select('_id');
    const buildingIds = [building._id, ...subBuildings.map(sb => sb._id)];
    const floors = await Floor.find({ building: { $in: buildingIds } });
    const bFloors = await Promise.all(floors.map(async (floor) => {
      const floorObj = floor.toObject();
      const rooms = await Room.find({ floor: floor._id }).populate({
        path: 'beds',
        populate: { path: 'tenant' }
      });
      floorObj.rooms = rooms.map(r => r.toObject());
      return floorObj;
    }));

    bObj.floors = bFloors;

    // Dynamically calculate live rooms, beds and occupancy
    let totalRooms = 0;
    let totalBeds = 0;
    let occupiedBeds = 0;
    
    bFloors.forEach(floor => {
      const rooms = floor.rooms || [];
      totalRooms += rooms.length;
      rooms.forEach(room => {
        const beds = room.beds || [];
        totalBeds += beds.length;
        occupiedBeds += beds.filter(b => b.status === 'OCCUPIED' || b.status === 'Occupied').length;
      });
    });
    
    bObj.totalRooms = totalRooms;
    bObj.totalBeds = totalBeds;
    bObj.occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    res.status(200).json(bObj);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getPublicBuildings = async (req, res) => {
  try {
    const buildings = await Building.find(
      { status: { $ne: 'Draft' }, propertyId: { $in: [null, undefined] }, showInPortfolio: { $ne: false } },
      {
        name: 1, address: 1, locationCity: 1, category: 1, rating: 1,
        startingPrice: 1, genderType: 1, amenities: 1, isAC: 1
      }
    ).lean();
    res.status(200).json(buildings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPublicBuildingById = async (req, res) => {
  try {
    const building = await Building.findOne({ _id: req.params.id, status: { $ne: 'Draft' } })
      .select('-draftData -staffInfo -owner -lastStep')
      .lean();

    if (!building) return res.status(404).json({ error: 'Building not found' });

    // Fetch all sub-buildings to get their IDs
    const subBuildings = await Building.find({ propertyId: building._id }).select('_id');
    const buildingIds = [building._id, ...subBuildings.map(sb => sb._id)];

    // Find floors for all these buildings and populate their rooms and beds
    const floors = await Floor.find({ building: { $in: buildingIds } })
      .select('floorNumber floorCategory description occupancyPercentage totalRooms totalBeds facilities rooms building')
      .lean();

    const populatedFloors = await Promise.all(floors.map(async (floor) => {
      const rooms = await Room.find({ floor: floor._id })
        .select('roomNumber roomType capacity isAC washroomType rentAmount securityDeposit amenities status beds')
        .populate({
          path: 'beds',
          select: 'bedNumber status position bedType smartBadges'
        })
        .lean();
      floor.rooms = rooms;
      return floor;
    }));

    building.floors = populatedFloors;

    // Fetch filled beds for this building
    const BedFilling = require('../models/BedFilling');
    const filledBeds = await BedFilling.find({ buildingId: { $in: buildingIds }, status: 'Occupied' })
      .select('bedId bedNumber')
      .lean();

    res.status(200).json({ ...building, filledBeds });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const uploadPhotos = async (req, res) => {
  try {
    const { buildingId } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const photoUrls = req.files.map(file => {
      const b64 = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${b64}`;
    });

    if (buildingId) {
      const photoDocs = photoUrls.map(url => ({
        buildingId,
        photoUrl: url
      }));
      await BuildingPhoto.insertMany(photoDocs, { ordered: false }).catch(err => {
        console.warn('[DEBUG] BuildingPhoto partial insertion warning:', err.message);
      });

      const building = await Building.findById(buildingId);
      if (building) {
        if (!building.images) building.images = [];
        building.images.push(...photoUrls);
        await building.save();
      }
    }

    res.status(200).json({ message: 'Photos uploaded successfully', photoUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlatformStats = async (req, res) => {
  try {
    const propertiesCount = await Building.countDocuments({ status: { $ne: 'Draft' }, propertyId: { $in: [null, undefined] }, showInPortfolio: { $ne: false } });
    const tenantsCount = await Tenant.countDocuments();
    const cities = await Building.distinct('locationCity', { status: { $ne: 'Draft' }, propertyId: { $in: [null, undefined] }, showInPortfolio: { $ne: false } });

    const buildings = await Building.find({ status: { $ne: 'Draft' }, propertyId: { $in: [null, undefined] }, showInPortfolio: { $ne: false } }, 'rating');
    let totalRating = 0;
    let validRatings = 0;
    buildings.forEach(b => {
      if (b.rating) { totalRating += b.rating; validRatings++; }
    });
    const avgRating = validRatings > 0 ? (totalRating / validRatings).toFixed(1) : "4.8";

    res.status(200).json({
      tenants: tenantsCount,
      properties: propertiesCount,
      cities: cities.length,
      rating: `${avgRating}/5`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBuilding,
  getBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
  bulkCreateBuildings,
  getPublicBuildings,
  getPublicBuildingById,
  uploadPhotos,
  getPlatformStats
};
