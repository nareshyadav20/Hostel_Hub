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
      policies, staffInfo, status, lastStep, draftData
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
    console.log(`[DEBUG] getBuildings query:`, JSON.stringify(query));
    const buildings = await Building.find(query)
      .select('-floors -images -draftData -gallery -description') // Exclude heavy fields (base64 images can be 300KB+)
      .lean();
    console.log(`[DEBUG] Found ${buildings.length} buildings for owner ${req.user.id}`);
    res.status(200).json(buildings);
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
    let building = await Building.findById(req.params.id).populate({
      path: 'floors',
      populate: {
        path: 'rooms',
        populate: {
          path: 'beds',
          populate: { path: 'tenant' }
        }
      }
    });

    if (!building) {
      const mongoose = require('mongoose');
      const db = mongoose.connection.db;
      let objId;
      try {
        objId = new mongoose.Types.ObjectId(req.params.id);
      } catch (e) {
        return res.status(404).json({ error: 'Building not found' });
      }

      const b = await db.collection('buildings').findOne({ _id: objId });
      if (!b) {
        return res.status(404).json({ error: 'Building not found' });
      }

      // Populate floors, rooms, beds from 'floors', 'rooms', 'beds'
      const bFloors = await db.collection('floors').find({ building: b._id }).toArray();
      for (const f of bFloors) {
        const fRooms = await db.collection('rooms').find({ floor: f._id }).toArray();
        for (const r of fRooms) {
          const rBeds = await db.collection('beds').find({ roomId: r._id }).toArray();
          for (const bed of rBeds) {
            if (bed.tenant) {
              bed.tenant = await db.collection('tenants').findOne({ _id: bed.tenant });
            }
          }
          r.beds = rBeds;
        }
        f.rooms = fRooms;
      }
      b.floors = bFloors;
      building = b;
    }

    res.status(200).json(building);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getPublicBuildings = async (req, res) => {
  try {
    const buildings = await Building.find(
      { status: { $ne: 'Draft' } },
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
    const building = await Building.findOne({ _id: req.params.id, status: { $ne: 'Draft' } }).populate({ path: 'floors', populate: { path: 'rooms', populate: { path: 'beds' } } });
    if (!building) return res.status(404).json({ error: 'Building not found' });

    // Fetch filled beds for this building
    const BedFilling = require('../models/BedFilling');
    const filledBeds = await BedFilling.find({ buildingId: building._id, status: 'Occupied' });

    res.status(200).json({ ...building.toObject(), filledBeds });
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
    const propertiesCount = await Building.countDocuments({ status: { $ne: 'Draft' } });
    const tenantsCount = await Tenant.countDocuments();
    const cities = await Building.distinct('locationCity', { status: { $ne: 'Draft' } });

    const buildings = await Building.find({ status: { $ne: 'Draft' } }, 'rating');
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
