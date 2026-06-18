const mongoose = require('mongoose');
const Building = require('../models/Building');
const Floor = require('../models/Floor');
const Room = require('../models/Room');
const Bed = require('../models/Bed');
const Tenant = require('../models/Tenant');
const BuildingPhoto = require('../models/BuildingPhoto');

const createBuilding = async (req, res) => {
  try {
    const {
      name, address, locationCity, description, amenities, images, documents,
      startingPrice, securityDeposit, maintenanceCharges, foodCharges,
      rentSingle, rentDouble, rentTriple, rent4Sharing, rent5Sharing, rent6Sharing, totalRooms, totalBeds,
      genderType, category, rating, popularityLabel,
      policies, staffInfo, status, lastStep, draftData, showInPortfolio,
      propertyId,
      security, cctv, parking, powerBackup, mess, gym, library, laundry, housekeeping, medicalSupport,
      lift, wifi, diningHall, commonKitchen, studyHall, laundryRoom, fireSafety, emergencyExit,
      isAC
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
    const finalDocuments = parseField(documents, []);
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

    const initialStatus = status || 'Draft';

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
      rent4Sharing,
      rent5Sharing,
      rent6Sharing,
      totalRooms: totalRooms || 0,
      totalBeds: totalBeds || 0,
      genderType: genderType || 'Mixed',
      category: category || 'Student',
      rating: rating || 4.5,
      popularityLabel,
      policies: finalPolicies,
      staffInfo: finalStaffInfo,
      status: initialStatus,
      approvalStatus: 'pending',
      isApproved: false,
      lastStep: lastStep || 1,
      draftData: finalDraftData,
      showInPortfolio: showInPortfolio !== undefined ? showInPortfolio : true,
      propertyId: propertyId || null,
      documents: finalDocuments,
      security, cctv, parking, powerBackup, mess, gym, library, laundry, housekeeping, medicalSupport,
      lift, wifi, diningHall, commonKitchen, studyHall, laundryRoom, fireSafety, emergencyExit,
      isAC,
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

    // Trigger Admin Notification if submitted for approval immediately
    if (initialStatus === 'Pending Approval' || initialStatus === 'Pending') {
      try {
        const Notification = require('../models/Notification');
        await Notification.create({
          moduleName: 'Properties',
          portalType: 'All',
          category: 'Hostel Approval',
          title: 'New Hostel Approval Request Received',
          message: `New hostel "${building.name}" has been submitted for approval.`,
          priority: 'High',
          type: 'info',
          receiverRole: 'All',
          buildingId: building._id,
          owner: req.user.id
        });
      } catch (notifErr) {
        console.error('[DEBUG] Failed to create admin notification:', notifErr.message);
      }
    }

    res.status(201).json(building);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getBuildings = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const isPlatformAdmin = req.user && req.user.role && ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role.toUpperCase());

    // Support querying owner IDs as both target mapped owner ID and original owner ID
    const ownerIds = ['69f5d174bb94a186e2747924', '6a0ef3a802c53c64d99e42d4'];
    if (req.user && req.user.id && !ownerIds.includes(req.user.id)) {
      ownerIds.push(req.user.id);
    }
    const queryOwnerIds = [];
    ownerIds.forEach(id => {
      queryOwnerIds.push(id);
      if (mongoose.Types.ObjectId.isValid(id)) {
        queryOwnerIds.push(new mongoose.Types.ObjectId(id));
      }
    });

    const query = isPlatformAdmin ? {} : { owner: { $in: queryOwnerIds } };

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
      query.propertyId = { $in: [null] };
      query.showInPortfolio = { $ne: false };
    }
    console.log(`[DEBUG] getBuildings query:`, JSON.stringify(query));

    const buildings = await Building.find(query)
      .select('-floors -images -draftData -gallery -description')
      .populate('owner', 'name phone email')
      .lean();

    const rawOwnerBuildings = await db.collection('owner_buildings').find(query).toArray();
    const User = require('../models/User');
    const populatedOwnerBuildings = await Promise.all(rawOwnerBuildings.map(async (ob) => {
      if (ob.owner && typeof ob.owner === 'object' && ob.owner._id) {
        // Already populated
      } else if (ob.owner) {
        const ownerUser = await User.findById(ob.owner).select('name phone email').lean();
        ob.owner = ownerUser || { _id: ob.owner, name: 'Unknown Owner' };
      }
      return ob;
    }));

    // Merge standard buildings and owner_buildings
    const mergedMap = new Map();
    buildings.forEach(b => mergedMap.set(b._id.toString(), b));
    populatedOwnerBuildings.forEach(b => {
      const idStr = b._id.toString();
      if (!mergedMap.has(idStr)) {
        const { floors, images, draftData, gallery, description, ...rest } = b;
        mergedMap.set(idStr, rest);
      }
    });
    const mergedBuildings = Array.from(mergedMap.values());

    const populatedBuildings = await Promise.all(mergedBuildings.map(async (building) => {
      // 1. Get floors from both floors and owner_floors
      const floorDocs = await Floor.find({ building: building._id }).lean();
      const rawOwnerFloors = await db.collection('owner_floors').find({
        $or: [
          { building: building._id },
          { buildingId: building._id },
          { building: building._id.toString() },
          { buildingId: building._id.toString() }
        ]
      }).toArray();

      const floorsMap = new Map();
      floorDocs.forEach(f => floorsMap.set(f._id.toString(), f));
      rawOwnerFloors.forEach(f => floorsMap.set(f._id.toString(), f));
      const allFloors = Array.from(floorsMap.values());
      const floorIds = allFloors.map(f => f._id);

      // 2. Get rooms from both rooms and owner_rooms
      const roomDocs = await Room.find({ floor: { $in: floorIds } }).populate('beds').lean();
      const rawOwnerRooms = floorIds.length > 0 ? await db.collection('owner_rooms').find({ floor: { $in: floorIds } }).toArray() : [];

      const roomsMap = new Map();
      roomDocs.forEach(r => roomsMap.set(r._id.toString(), r));

      if (rawOwnerRooms.length > 0) {
        const ownerRoomIds = rawOwnerRooms.map(r => r._id);
        const rawBeds = await Bed.find({ room: { $in: ownerRoomIds } }).lean();
        const rawOwnerBeds = await db.collection('owner_beds').find({
          $or: [
            { room: { $in: ownerRoomIds } },
            { roomId: { $in: ownerRoomIds } }
          ]
        }).toArray();

        const bedsMap = new Map();
        rawBeds.forEach(b => bedsMap.set(b._id.toString(), b));
        rawOwnerBeds.forEach(b => bedsMap.set(b._id.toString(), b));
        const allBedsForOwnerRooms = Array.from(bedsMap.values());

        rawOwnerRooms.forEach(room => {
          const roomIdStr = room._id.toString();
          room.beds = allBedsForOwnerRooms.filter(b =>
            (b.room && b.room.toString() === roomIdStr) ||
            (b.roomId && b.roomId.toString() === roomIdStr)
          );
          roomsMap.set(roomIdStr, room);
        });
      }

      const allRooms = Array.from(roomsMap.values());

      let totalBeds = 0;
      let occupiedBeds = 0;

      allRooms.forEach(room => {
        const beds = room.beds || [];
        totalBeds += beds.length;
        occupiedBeds += beds.filter(b => b.status === 'OCCUPIED' || b.status === 'Occupied').length;
      });

      building.totalRooms = allRooms.length;
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
    if (updateData.documents) {
      updateData.documents = parseField(updateData.documents, []);
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

    // Set approval status if submitted or resubmitted
    if (updateData.status === 'Pending Approval' || updateData.status === 'Pending') {
      updateData.approvalStatus = 'pending';
      updateData.isApproved = false;
      updateData.rejectionReason = null;
    }

    let building = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      building = await Building.findByIdAndUpdate(req.params.id, updateData, { new: true });
    }

    const db = mongoose.connection.db;
    let obQuery = {};
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      obQuery._id = new mongoose.Types.ObjectId(req.params.id);
    } else {
      obQuery._id = req.params.id;
    }

    const obExists = await db.collection('owner_buildings').findOne(obQuery);
    if (obExists) {
      await db.collection('owner_buildings').updateOne(obQuery, { $set: updateData });
      if (!building) {
        building = await db.collection('owner_buildings').findOne(obQuery);
      }
    }

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

    // Create Admin notification for resubmission
    if (updateData.status === 'Pending Approval' || updateData.status === 'Pending') {
      try {
        const Notification = require('../models/Notification');
        const notifExists = await Notification.findOne({ buildingId: building._id, title: 'New Hostel Approval Request Received', isRead: false });
        if (!notifExists) {
          await Notification.create({
            moduleName: 'Properties',
            portalType: 'All',
            category: 'Hostel Approval',
            title: 'New Hostel Approval Request Received',
            message: `New hostel "${building.name}" has been submitted for approval.`,
            priority: 'High',
            type: 'info',
            receiverRole: 'All',
            buildingId: building._id,
            owner: req.user.id
          });
        }
      } catch (notifErr) {
        console.error('[DEBUG] Failed to create admin notification on update:', notifErr.message);
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
    let building = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      building = await Building.findById(req.params.id);
    }

    const db = mongoose.connection.db;
    let obQuery = {};
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      obQuery._id = new mongoose.Types.ObjectId(req.params.id);
    } else {
      obQuery._id = req.params.id;
    }
    const obBuilding = await db.collection('owner_buildings').findOne(obQuery);

    if (!building && !obBuilding) return res.status(404).json({ error: 'Building not found' });

    // Perform Cascade Delete
    // 1. Find all floors in this building
    const floors = await Floor.find({ building: req.params.id });
    const ownerFloors = await db.collection('owner_floors').find({
      $or: [
        { building: req.params.id },
        { buildingId: req.params.id },
        { building: req.params.id.toString() },
        { buildingId: req.params.id.toString() }
      ]
    }).toArray();

    const floorIds = [
      ...floors.map(f => f._id),
      ...ownerFloors.map(f => f._id)
    ];

    // 2. Find all rooms in these floors
    const rooms = await Room.find({ floor: { $in: floorIds } });
    const ownerRooms = floorIds.length > 0 ? await db.collection('owner_rooms').find({ floor: { $in: floorIds } }).toArray() : [];

    const roomIds = [
      ...rooms.map(r => r._id),
      ...ownerRooms.map(r => r._id)
    ];

    // 3. Delete all beds in these rooms
    if (roomIds.length > 0) {
      await Bed.deleteMany({ room: { $in: roomIds } });
      await db.collection('owner_beds').deleteMany({
        $or: [
          { room: { $in: roomIds } },
          { roomId: { $in: roomIds } }
        ]
      });
    }

    // 4. Delete all rooms
    if (floorIds.length > 0) {
      await Room.deleteMany({ floor: { $in: floorIds } });
      await db.collection('owner_rooms').deleteMany({ floor: { $in: floorIds } });
    }

    // 5. Delete all floors
    await Floor.deleteMany({ building: req.params.id });
    await db.collection('owner_floors').deleteMany({
      $or: [
        { building: req.params.id },
        { buildingId: req.params.id },
        { building: req.params.id.toString() },
        { buildingId: req.params.id.toString() }
      ]
    });

    // 6. Delete or update tenants associated with this building
    await Tenant.deleteMany({ buildingId: req.params.id });
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      await Tenant.deleteMany({ buildingId: new mongoose.Types.ObjectId(req.params.id) });
    }

    // 7. Finally delete the building itself
    if (building) {
      await Building.findByIdAndDelete(req.params.id);
    }
    if (obBuilding) {
      await db.collection('owner_buildings').deleteOne(obQuery);
    }

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
    let buildingDoc = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      buildingDoc = await Building.findById(req.params.id).populate('owner', 'name phone email').lean();
    }
    const db = mongoose.connection.db;
    if (!buildingDoc) {
      let obQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        obQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        obQuery._id = req.params.id;
      }
      buildingDoc = await db.collection('owner_buildings').findOne(obQuery);
      if (buildingDoc && buildingDoc.owner) {
        const User = require('../models/User');
        const ownerUser = await User.findById(buildingDoc.owner).select('name phone email').lean();
        buildingDoc.owner = ownerUser || buildingDoc.owner;
      }
    }
    if (!buildingDoc) return res.status(404).json({ error: 'Building not found' });

    const bObj = buildingDoc;

    // Query floors directly for the building and its sub-buildings
    const subBuildings = await Building.find({ propertyId: bObj._id }).select('_id').lean();
    const subOwnerBuildings = await db.collection('owner_buildings').find({ propertyId: bObj._id }).toArray();
    const buildingIds = [bObj._id, ...subBuildings.map(sb => sb._id), ...subOwnerBuildings.map(sb => sb._id)];

    const floors = await Floor.find({ building: { $in: buildingIds } }).lean();
    const ownerFloors = await db.collection('owner_floors').find({
      $or: [
        { building: { $in: buildingIds } },
        { buildingId: { $in: buildingIds } }
      ]
    }).toArray();

    const floorsMap = new Map();
    floors.forEach(f => floorsMap.set(f._id.toString(), f));
    ownerFloors.forEach(f => floorsMap.set(f._id.toString(), f));
    const allFloors = Array.from(floorsMap.values());

    const bFloors = await Promise.all(allFloors.map(async (floor) => {
      const floorObj = floor;
      const rooms = await Room.find({ floor: floor._id }).populate({
        path: 'beds',
        populate: { path: 'tenant' }
      }).lean();
      const ownerRooms = await db.collection('owner_rooms').find({ floor: floor._id }).toArray();

      const roomsMap = new Map();
      rooms.forEach(r => roomsMap.set(r._id.toString(), r));

      if (ownerRooms.length > 0) {
        const ownerRoomIds = ownerRooms.map(r => r._id);
        const beds = await Bed.find({ room: { $in: ownerRoomIds } }).populate('tenant').lean();
        const ownerBeds = await db.collection('owner_beds').find({
          $or: [
            { room: { $in: ownerRoomIds } },
            { roomId: { $in: ownerRoomIds } }
          ]
        }).toArray();

        // Populate tenant for ownerBeds
        const ownerBedIds = ownerBeds.map(b => b._id);
        const tenants = await Tenant.find({
          $or: [
            { bedId: { $in: ownerBedIds } },
            { bedId: { $in: ownerBedIds.map(id => id.toString()) } }
          ]
        }).lean();

        const populatedOwnerBeds = ownerBeds.map(b => {
          const tenantDoc = tenants.find(t =>
            (t.bedId && t.bedId.toString() === b._id.toString())
          );
          return { ...b, tenant: tenantDoc || null };
        });

        const bedsMap = new Map();
        beds.forEach(b => bedsMap.set(b._id.toString(), b));
        populatedOwnerBeds.forEach(b => bedsMap.set(b._id.toString(), b));
        const allBeds = Array.from(bedsMap.values());

        ownerRooms.forEach(room => {
          const roomIdStr = room._id.toString();
          room.beds = allBeds.filter(b =>
            (b.room && b.room.toString() === roomIdStr) ||
            (b.roomId && b.roomId.toString() === roomIdStr)
          );
          roomsMap.set(roomIdStr, room);
        });
      }

      floorObj.rooms = Array.from(roomsMap.values());
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
    const publicQuery = {
      $or: [
        { approvalStatus: 'approved', isApproved: true },
        { status: 'Active', approvalStatus: { $in: [null, undefined] } }
      ],
      propertyId: { $in: [null, undefined] },
      showInPortfolio: { $ne: false }
    };

    const buildings = await Building.find(
      publicQuery,
      {
        name: 1, address: 1, locationCity: 1, category: 1, rating: 1,
        startingPrice: 1, genderType: 1, amenities: 1, isAC: 1
      }
    ).lean();

    const db = mongoose.connection.db;
    const ownerBuildings = await db.collection('owner_buildings').find(
      publicQuery,
      {
        projection: {
          name: 1, address: 1, locationCity: 1, category: 1, rating: 1,
          startingPrice: 1, genderType: 1, amenities: 1, isAC: 1
        }
      }
    ).toArray();

    const mergedMap = new Map();
    buildings.forEach(b => mergedMap.set(b._id.toString(), b));
    ownerBuildings.forEach(b => {
      const idStr = b._id.toString();
      if (!mergedMap.has(idStr)) {
        mergedMap.set(idStr, b);
      }
    });

    res.status(200).json(Array.from(mergedMap.values()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPublicBuildingById = async (req, res) => {
  try {
    let building = null;
    const publicQuery = {
      $or: [
        { approvalStatus: 'approved', isApproved: true },
        { status: 'Active', approvalStatus: { $in: [null, undefined] } }
      ]
    };

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      building = await Building.findOne({ _id: req.params.id, ...publicQuery })
        .select('-draftData -staffInfo -owner -lastStep')
        .lean();
    }
    const db = mongoose.connection.db;
    if (!building) {
      let obQuery = { ...publicQuery };
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        obQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        obQuery._id = req.params.id;
      }
      const rawBuilding = await db.collection('owner_buildings').findOne(obQuery);
      if (rawBuilding) {
        const { draftData, staffInfo, owner, lastStep, ...rest } = rawBuilding;
        building = rest;
      }
    }
    if (!building) return res.status(404).json({ error: 'Building not found or not approved' });

    // Fetch all sub-buildings to get their IDs
    const subBuildings = await Building.find({ propertyId: building._id }).select('_id').lean();
    const subOwnerBuildings = await db.collection('owner_buildings').find({ propertyId: building._id }).toArray();
    const buildingIds = [building._id, ...subBuildings.map(sb => sb._id), ...subOwnerBuildings.map(sb => sb._id)];

    // Find floors for all these buildings and populate their rooms and beds
    const floors = await Floor.find({ building: { $in: buildingIds } })
      .select('floorNumber floorCategory description occupancyPercentage totalRooms totalBeds facilities rooms building')
      .lean();
    const ownerFloors = await db.collection('owner_floors').find({
      $or: [
        { building: { $in: buildingIds } },
        { buildingId: { $in: buildingIds } }
      ]
    }).toArray();

    const floorsMap = new Map();
    floors.forEach(f => floorsMap.set(f._id.toString(), f));
    ownerFloors.forEach(f => floorsMap.set(f._id.toString(), f));
    const allFloors = Array.from(floorsMap.values());

    const populatedFloors = await Promise.all(allFloors.map(async (floor) => {
      const rooms = await Room.find({ floor: floor._id })
        .populate({
          path: 'beds',
          populate: {
            path: 'tenant',
            select: 'name checkInDate targetStayDuration'
          }
        })
        .lean();
      const ownerRooms = await db.collection('owner_rooms').find({ floor: floor._id }).toArray();

      const roomsMap = new Map();
      rooms.forEach(r => roomsMap.set(r._id.toString(), r));

      if (ownerRooms.length > 0) {
        const ownerRoomIds = ownerRooms.map(r => r._id);
        const beds = await Bed.find({ room: { $in: ownerRoomIds } })
          .select('bedNumber status position bedType smartBadges')
          .lean();
        const ownerBeds = await db.collection('owner_beds').find({
          $or: [
            { room: { $in: ownerRoomIds } },
            { roomId: { $in: ownerRoomIds } }
          ]
        }).toArray();

        const bedsMap = new Map();
        beds.forEach(b => bedsMap.set(b._id.toString(), b));
        ownerBeds.forEach(b => bedsMap.set(b._id.toString(), b));
        const allBeds = Array.from(bedsMap.values());

        ownerRooms.forEach(room => {
          const roomIdStr = room._id.toString();
          room.beds = allBeds.filter(b =>
            (b.room && b.room.toString() === roomIdStr) ||
            (b.roomId && b.roomId.toString() === roomIdStr)
          );
          roomsMap.set(roomIdStr, room);
        });
      }

      floor.rooms = Array.from(roomsMap.values());
      return floor;
    }));

    building.floors = populatedFloors;

    // Fetch filled beds for this building
    const BedFilling = require('../models/BedFilling');
    const filledBeds = await BedFilling.find({ buildingId: { $in: buildingIds }, status: 'Occupied' })
      .select('bedId bedNumber')
      .lean();

    res.status(200).json({ ...building, subBuildings, filledBeds });
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

      let building = await Building.findById(buildingId);
      if (building) {
        if (!building.images) building.images = [];
        building.images.push(...photoUrls);
        await building.save();
      } else {
        const db = mongoose.connection.db;
        let obQuery = {};
        if (mongoose.Types.ObjectId.isValid(buildingId)) {
          obQuery._id = new mongoose.Types.ObjectId(buildingId);
        } else {
          obQuery._id = buildingId;
        }
        const obBuilding = await db.collection('owner_buildings').findOne(obQuery);
        if (obBuilding) {
          const currentImages = obBuilding.images || [];
          currentImages.push(...photoUrls);
          await db.collection('owner_buildings').updateOne(obQuery, { $set: { images: currentImages } });
        }
      }
    }

    res.status(200).json({ message: 'Photos uploaded successfully', photoUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBuildingPortfolio = async (req, res) => {
  try {
    let building = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      building = await Building.findById(req.params.id).populate('owner', 'name phone email').lean();
    }
    const db = mongoose.connection.db;
    if (!building) {
      let obQuery = {};
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        obQuery._id = new mongoose.Types.ObjectId(req.params.id);
      } else {
        obQuery._id = req.params.id;
      }
      building = await db.collection('owner_buildings').findOne(obQuery);
      if (building && building.owner) {
        const User = require('../models/User');
        const ownerUser = await User.findById(building.owner).select('name phone email').lean();
        building.owner = ownerUser || building.owner;
      }
    }
    if (!building) return res.status(404).json({ error: 'Building not found' });

    // Populate floors, rooms, and beds for portfolio view
    const floors = await Floor.find({ building: building._id }).lean();
    const ownerFloors = await db.collection('owner_floors').find({
      $or: [
        { building: building._id },
        { buildingId: building._id }
      ]
    }).toArray();

    const floorsMap = new Map();
    floors.forEach(f => floorsMap.set(f._id.toString(), f));
    ownerFloors.forEach(f => floorsMap.set(f._id.toString(), f));
    const allFloors = Array.from(floorsMap.values());

    const populatedFloors = await Promise.all(allFloors.map(async (floor) => {
      const rooms = await Room.find({ floor: floor._id })
        .populate({
          path: 'beds',
          select: 'bedNumber status position bedType'
        })
        .lean();
      const ownerRooms = await db.collection('owner_rooms').find({ floor: floor._id }).toArray();

      const roomsMap = new Map();
      rooms.forEach(r => roomsMap.set(r._id.toString(), r));

      if (ownerRooms.length > 0) {
        const ownerRoomIds = ownerRooms.map(r => r._id);
        const beds = await Bed.find({ room: { $in: ownerRoomIds } })
          .select('bedNumber status position bedType')
          .lean();
        const ownerBeds = await db.collection('owner_beds').find({
          $or: [
            { room: { $in: ownerRoomIds } },
            { roomId: { $in: ownerRoomIds } }
          ]
        }).toArray();

        const bedsMap = new Map();
        beds.forEach(b => bedsMap.set(b._id.toString(), b));
        ownerBeds.forEach(b => bedsMap.set(b._id.toString(), b));
        const allBeds = Array.from(bedsMap.values());

        ownerRooms.forEach(room => {
          const roomIdStr = room._id.toString();
          room.beds = allBeds.filter(b =>
            (b.room && b.room.toString() === roomIdStr) ||
            (b.roomId && b.roomId.toString() === roomIdStr)
          );
          roomsMap.set(roomIdStr, room);
        });
      }

      floor.rooms = Array.from(roomsMap.values());
      return floor;
    }));

    building.floors = populatedFloors;

    // Calculate occupancy stats
    let totalBeds = 0;
    let occupiedBeds = 0;
    populatedFloors.forEach(floor => {
      (floor.rooms || []).forEach(room => {
        const beds = room.beds || [];
        totalBeds += beds.length;
        occupiedBeds += beds.filter(b => b.status === 'OCCUPIED' || b.status === 'Occupied').length;
      });
    });

    building.totalRooms = populatedFloors.reduce((sum, f) => sum + (f.rooms || []).length, 0);
    building.totalBeds = totalBeds;
    building.occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    // Fetch photos
    const photos = await BuildingPhoto.find({ buildingId: building._id }).lean();
    building.gallery = photos.map(p => p.photoUrl);

    res.status(200).json(building);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlatformStats = async (req, res) => {
  try {
    const statsQuery = {
      $or: [
        { approvalStatus: 'approved', isApproved: true },
        { status: 'Active', approvalStatus: { $in: [null, undefined] } }
      ],
      propertyId: { $in: [null, undefined] },
      showInPortfolio: { $ne: false }
    };

    const propertiesCount = await Building.countDocuments(statsQuery);
    const db = mongoose.connection.db;
    const obCount = await db.collection('owner_buildings').countDocuments(statsQuery);

    const tenantsCount = await Tenant.countDocuments();

    const cities = await Building.distinct('locationCity', statsQuery);
    const obCities = await db.collection('owner_buildings').distinct('locationCity', statsQuery);

    const uniqueCities = new Set([...cities, ...obCities].filter(Boolean));

    const buildings = await Building.find(statsQuery, 'rating genderType category locationCity').lean();
    const obBuildings = await db.collection('owner_buildings').find(statsQuery, { projection: { rating: 1, genderType: 1, category: 1, locationCity: 1 } }).toArray();

    const allBuildings = [...buildings, ...obBuildings];

    let totalRating = 0;
    let validRatings = 0;
    const categoryStats = { mens: 0, womens: 0, coliving: 0, premium: 0, student: 0 };
    const cityStats = {};

    allBuildings.forEach(b => {
      if (b.rating) { totalRating += b.rating; validRatings++; }
      
      if (b.locationCity) {
        const cityKey = b.locationCity.toLowerCase();
        cityStats[cityKey] = (cityStats[cityKey] || 0) + 1;
      }

      const gender = (b.genderType || '').toLowerCase();
      const cat = (b.category || '').toLowerCase();

      if (['boys', 'male', 'men', "men's"].includes(gender)) categoryStats.mens++;
      if (['girls', 'female', 'women', "women's"].includes(gender)) categoryStats.womens++;
      if (['unisex', 'mixed', 'co-living', 'coliving', 'both'].includes(gender)) categoryStats.coliving++;
      
      if (cat === 'luxury' || cat === 'premium') categoryStats.premium++;
      if (cat === 'student') categoryStats.student++;
    });

    const avgRating = validRatings > 0 ? (totalRating / validRatings).toFixed(1) : "4.8";

    res.status(200).json({
      tenants: tenantsCount,
      properties: propertiesCount + obCount,
      cities: uniqueCities.size,
      rating: `${avgRating}/5`,
      categoryStats,
      cityStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const seedBalanced = async (req, res) => {
  try {
    const CITIES = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Chennai', 'Delhi', 'Pune', 'Noida', 'Gurgaon'];
    const CATEGORIES = [
      { genderType: 'Boys', category: 'Student' }, // Mens & Student -> falls into student or mens depending on order
      { genderType: 'Girls', category: 'Student' },
      { genderType: 'Mixed', category: 'Co-living' },
      { genderType: 'Mixed', category: 'Premium' },
      { genderType: 'Boys', category: 'Professional' },
      { genderType: 'Girls', category: 'Professional' }
    ];
    const AMENITIES = ['WiFi', 'CCTV', 'Power Backup', 'Gym', 'Laundry', 'Meals', 'AC'];

    // Grab the actual User model
    const User = require('../models/User');
    let owner = await User.findOne({ role: 'OWNER' }) || await User.findOne();
    const ownerId = owner ? owner._id : '654321098765432109876543';

    // Clear old properties
    await Building.deleteMany({});
    const buildings = [];
    let counter = 1;

    for (const city of CITIES) {
      // 5 properties per city to make it balanced (total 40 properties)
      for (let i = 0; i < 5; i++) {
        const catCombo = CATEGORIES[i % CATEGORIES.length];

        // Force specific categories for perfect balancing using valid enums
        let finalGender = 'Mixed';
        let finalCat = 'Mixed';

        if (i === 0) { finalGender = 'Boys'; finalCat = 'Professional'; } // mens
        if (i === 1) { finalGender = 'Girls'; finalCat = 'Professional'; } // womens
        if (i === 2) { finalGender = 'Mixed'; finalCat = 'Mixed'; } // coliving (gender: mixed, category: mixed)
        if (i === 3) { finalGender = 'Mixed'; finalCat = 'Luxury'; } // premium (category: luxury)
        if (i === 4) { finalGender = 'Boys'; finalCat = 'Student'; } // student

        const rentSingle = 12000 + Math.floor(Math.random() * 3000);
        const rentDouble = 10000 + Math.floor(Math.random() * 2000);
        const rentTriple = 8000 + Math.floor(Math.random() * 1500);
        const rent4Sharing = 7000 + Math.floor(Math.random() * 1000);
        const rent5Sharing = 6000 + Math.floor(Math.random() * 1000);

        buildings.push({
          name: `${city} Stay ${counter++}`,
          address: `Central Hub, ${city}`,
          locationCity: city,
          description: `A beautiful and secure stay located in the heart of ${city}.`,
          startingPrice: rent5Sharing,
          rentSingle,
          rentDouble,
          rentTriple,
          rent4Sharing,
          rent5Sharing,
          genderType: finalGender,
          category: finalCat,
          amenities: AMENITIES.slice(0, 3 + Math.floor(Math.random() * 4)),
          images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'],
          status: 'Active',
          owner: ownerId,
          showInPortfolio: true
        });
      }
    }

    await Building.insertMany(buildings);
    console.log(`[SEED] Inserted ${buildings.length} balanced buildings`);
    res.status(200).json({ message: `Successfully seeded ${buildings.length} balanced properties.` });
  } catch (error) {
    console.error('[SEED ERROR]', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

module.exports = {
  createBuilding,
  getBuildings,
  getBuildingById,
  getBuildingPortfolio,
  updateBuilding,
  deleteBuilding,
  bulkCreateBuildings,
  getPublicBuildings,
  getPublicBuildingById,
  uploadPhotos,
  getPlatformStats,
  seedBalanced
};
