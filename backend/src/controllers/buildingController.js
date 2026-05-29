const Building = require('../models/Building');
const Floor = require('../models/Floor');
const Room = require('../models/Room');
const Bed = require('../models/Bed');
const Tenant = require('../models/Tenant');
const BuildingPhoto = require('../models/BuildingPhoto');
const User = require('../models/User');
const Staff = require('../models/Staff');
const OwnerProfile = require('../models/OwnerProfile');
const Payment = require('../models/Payment');

const createBuilding = async (req, res) => {
  try {
    const {
      name, address, locationCity, description, amenities, images,
      startingPrice, securityDeposit, maintenanceCharges, foodCharges,
      rentSingle, rentDouble, rentTriple, totalRooms, totalBeds,
      genderType, category, rating, popularityLabel,
      policies, staffInfo, status, lastStep, draftData
    } = req.body;

    const building = await Building.create({
      name: name || 'Untitled Draft',
      address,
      locationCity: locationCity || 'Bengaluru',
      description,
      amenities: amenities || [],
      images: images || [],
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
      policies: policies || { smoking: 'Not Allowed', alcohol: 'Not Allowed', pets: 'No', visitors: 'Till 8 PM' },
      staffInfo,
      status: status || 'Active',
      lastStep: lastStep || 1,
      draftData,
      owner: req.user.id
    });

    // Sync photos to BuildingPhoto collection
    if (images && images.length > 0) {
      const photoDocs = images.map(url => ({
        buildingId: building._id,
        photoUrl: url
      }));
      await BuildingPhoto.insertMany(photoDocs);
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
      .select('-floors -images -draftData -gallery -description') // Exclude heavy fields
      .populate('owner', 'name')
      .lean();
    console.log(`[DEBUG] Found ${buildings.length} buildings. Enriching with stats...`);

    // Enrich buildings with Tenant, Staff counts and room stats
    const enrichedBuildings = await Promise.all(buildings.map(async (b) => {
      // Fetch stats
      const tenantCount = await Tenant.countDocuments({ buildingId: b._id });
      const staffCount = await Staff.countDocuments({ buildingId: b._id });
      
      const floors = await Floor.find({ building: b._id }, '_id');
      const floorIds = floors.map(f => f._id);
      
      const totalRoomsCount = await Room.countDocuments({ floor: { $in: floorIds } });
      const occupiedRoomsCount = await Room.countDocuments({ floor: { $in: floorIds }, status: 'FULL' });
      const maintenanceRoomsCount = await Room.countDocuments({ floor: { $in: floorIds }, status: 'MAINTENANCE' });
      const vacantRoomsCount = totalRoomsCount - occupiedRoomsCount - maintenanceRoomsCount;

      return {
        ...b,
        tenantCount,
        staffCount,
        totalRoomsCount,
        occupiedRoomsCount,
        vacantRoomsCount,
        maintenanceRoomsCount
      };
    }));

    res.status(200).json(enrichedBuildings);
  } catch (error) {
    console.error(`[DEBUG] getBuildings error:`, error);
    res.status(500).json({ error: error.message });
  }
};

const updateBuilding = async (req, res) => {
  try {
    const building = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!building) return res.status(404).json({ error: 'Building not found' });

    // Sync new photos to BuildingPhoto collection
    if (req.body.images && Array.isArray(req.body.images)) {
      for (const url of req.body.images) {
        const exists = await BuildingPhoto.findOne({ buildingId: building._id, photoUrl: url });
        if (!exists) {
          await BuildingPhoto.create({ buildingId: building._id, photoUrl: url });
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

      // Batch fetch floors, rooms, beds, and tenants
      const bFloors = await db.collection('floors').find({ building: b._id }).toArray();
      const floorIds = bFloors.map(f => f._id);
      
      const fRooms = await db.collection('rooms').find({ floor: { $in: floorIds } }).toArray();
      const roomIds = fRooms.map(r => r._id);
      
      const rBeds = await db.collection('beds').find({ roomId: { $in: roomIds } }).toArray();
      
      const tenantIds = rBeds.map(bed => bed.tenant).filter(Boolean);
      const tenantsList = await db.collection('tenants').find({ _id: { $in: tenantIds } }).toArray();
      const tenantMap = {};
      tenantsList.forEach(t => {
        tenantMap[t._id.toString()] = t;
      });

      const bedsByRoomId = {};
      rBeds.forEach(bed => {
        if (bed.tenant) {
          bed.tenant = tenantMap[bed.tenant.toString()] || null;
        }
        const roomIdStr = bed.roomId.toString();
        if (!bedsByRoomId[roomIdStr]) bedsByRoomId[roomIdStr] = [];
        bedsByRoomId[roomIdStr].push(bed);
      });

      const roomsByFloorId = {};
      fRooms.forEach(room => {
        room.beds = bedsByRoomId[room._id.toString()] || [];
        const floorIdStr = room.floor.toString();
        if (!roomsByFloorId[floorIdStr]) roomsByFloorId[floorIdStr] = [];
        roomsByFloorId[floorIdStr].push(room);
      });

      bFloors.forEach(f => {
        f.rooms = roomsByFloorId[f._id.toString()] || [];
      });

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

const getBuildingPortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const mongoose = require('mongoose');

    // 1. Fetch building (hostel) details with robust model and collection fallback
    let building = await Building.findById(id)
      .populate({
        path: 'floors',
        populate: {
          path: 'rooms',
          populate: {
            path: 'beds',
            populate: { path: 'tenant', select: 'name phone email' }
          }
        }
      });

    if (!building) {
      const db = mongoose.connection.db;
      let objId;
      try {
        objId = new mongoose.Types.ObjectId(id);
      } catch (e) {
        return res.status(404).json({ error: 'Building ID is invalid' });
      }

      const b = await db.collection('buildings').findOne({ _id: objId });
      if (!b) {
        return res.status(404).json({ error: 'Hostel not found' });
      }

      // Batch fetch floors, rooms, beds, and tenants
      const bFloors = await db.collection('floors').find({ building: b._id }).toArray();
      const floorIds = bFloors.map(f => f._id);
      
      const fRooms = await db.collection('rooms').find({ floor: { $in: floorIds } }).toArray();
      const roomIds = fRooms.map(r => r._id);
      
      const rBeds = await db.collection('beds').find({ roomId: { $in: roomIds } }).toArray();
      
      const tenantIds = rBeds.map(bed => bed.tenant).filter(Boolean);
      const tenantsList = await db.collection('tenants').find({ _id: { $in: tenantIds } }, { projection: { name: 1, phone: 1, email: 1 } }).toArray();
      const tenantMap = {};
      tenantsList.forEach(t => {
        tenantMap[t._id.toString()] = t;
      });

      const bedsByRoomId = {};
      rBeds.forEach(bed => {
        if (bed.tenant) {
          bed.tenant = tenantMap[bed.tenant.toString()] || null;
        }
        const roomIdStr = bed.roomId.toString();
        if (!bedsByRoomId[roomIdStr]) bedsByRoomId[roomIdStr] = [];
        bedsByRoomId[roomIdStr].push(bed);
      });

      const roomsByFloorId = {};
      fRooms.forEach(room => {
        room.beds = bedsByRoomId[room._id.toString()] || [];
        const floorIdStr = room.floor.toString();
        if (!roomsByFloorId[floorIdStr]) roomsByFloorId[floorIdStr] = [];
        roomsByFloorId[floorIdStr].push(room);
      });

      bFloors.forEach(f => {
        f.rooms = roomsByFloorId[f._id.toString()] || [];
      });

      b.floors = bFloors;
      building = b;
    }

    // 2. Fetch Owner details
    const ownerUser = await User.findById(building.owner).select('-password').lean();
    const ownerProfile = await OwnerProfile.findOne({ userId: building.owner }).lean();
    const ownerBuildings = await Building.find({ owner: building.owner }, 'name address').lean();

    const ownerDetails = {
      name: ownerUser?.name || 'Unknown Owner',
      phone: ownerUser?.phone || ownerProfile?.personalInfo?.phone || 'N/A',
      email: ownerUser?.email || ownerProfile?.personalInfo?.email || 'N/A',
      address: ownerProfile?.personalInfo?.address || 'N/A',
      profilePhoto: ownerProfile?.personalInfo?.profilePhotoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      assignedHostels: ownerBuildings.map(ob => ({ id: ob._id, name: ob.name, address: ob.address }))
    };

    // 3. Fetch Tenant details with payment history
    const tenants = await Tenant.find({ buildingId: id }).lean();
    const payments = await Payment.find({ buildingId: id }).sort({ date: -1 }).lean();

    const tenantsEnriched = tenants.map(tenant => {
      const tenantPayments = payments
        .filter(p => p.tenantId && p.tenantId.toString() === tenant._id.toString())
        .map(p => ({
          id: p._id,
          amount: p.amount,
          status: p.status,
          date: p.date,
          type: p.type,
          method: p.method,
          invoice: p.invoice,
          transactionId: p.transactionId
        }));

      const isVerified = tenant.docs && tenant.docs.some(doc => doc.verified);

      return {
        id: tenant._id,
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        room: tenant.room || 'N/A',
        bedNumber: tenant.bedId ? 'Allocated' : 'N/A',
        checkInDate: tenant.checkInDate || tenant.createdAt,
        rentStatus: tenant.rentStatus || 'PENDING',
        paymentHistory: tenantPayments,
        isVerified: isVerified ? 'Verified' : 'Pending',
        profilePhoto: tenant.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
      };
    });

    // 4. Fetch Staff details
    const staffList = await Staff.find({ buildingId: id }).lean();
    const staffEnriched = staffList.map(s => {
      const latestSalaryStatus = s.salaryHistory && s.salaryHistory.length > 0
        ? s.salaryHistory[s.salaryHistory.length - 1].status
        : 'Paid';

      return {
        id: s._id,
        name: s.name,
        role: s.role,
        phone: s.phone,
        email: s.email || 'N/A',
        shift: s.shift || 'Full Time',
        salaryStatus: latestSalaryStatus,
        attendanceStatus: s.attendance?.percentage !== undefined ? `${s.attendance.percentage}%` : '100%',
        profilePhoto: s.profilePhoto || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
        assignedFloors: 'All Floors'
      };
    });

    // 5. Aggregate Room & Occupancy Analytics
    let totalRooms = 0;
    let occupiedRooms = 0;
    let vacantRooms = 0;
    let maintenanceRooms = 0;
    let totalBeds = 0;
    let occupiedBeds = 0;

    const floorWiseOccupancy = [];

    if (building.floors && building.floors.length > 0) {
      building.floors.forEach(floor => {
        let floorBeds = 0;
        let floorOccupiedBeds = 0;
        let floorRoomsCount = 0;

        if (floor.rooms && floor.rooms.length > 0) {
          floorRoomsCount = floor.rooms.length;
          totalRooms += floorRoomsCount;

          floor.rooms.forEach(room => {
            if (room.status === 'MAINTENANCE') {
              maintenanceRooms++;
            } else if (room.status === 'AVAILABLE') {
              vacantRooms++;
            } else {
              occupiedRooms++;
            }

            const capacity = room.capacity || 0;
            totalBeds += capacity;
            floorBeds += capacity;

            if (room.beds && room.beds.length > 0) {
              room.beds.forEach(bed => {
                if (bed.status === 'OCCUPIED') {
                  occupiedBeds++;
                  floorOccupiedBeds++;
                }
              });
            }
          });
        }

        floorWiseOccupancy.push({
          floorId: floor._id,
          floorNumber: `Floor ${floor.floorNumber}`,
          totalRooms: floorRoomsCount,
          totalBeds: floorBeds,
          occupiedBeds: floorOccupiedBeds,
          occupancyPercentage: floorBeds > 0 ? Math.round((floorOccupiedBeds / floorBeds) * 100) : 0
        });
      });
    }

    const occupancyRate = totalBeds > 0 ? Math.min(100, Math.round((occupiedBeds / totalBeds) * 100)) : 0;
    const monthlyRevenue = occupiedBeds * (building.startingPrice || 8500);

    const analytics = {
      totalRooms,
      occupiedRooms,
      vacantRooms,
      maintenanceRooms,
      totalBeds,
      occupiedBeds,
      vacantBeds: totalBeds - occupiedBeds,
      occupancyRate,
      monthlyRevenue,
      floorWiseOccupancy
    };

    res.status(200).json({
      hostelDetails: {
        id: building._id,
        name: building.name,
        address: building.address,
        locationCity: building.locationCity,
        category: building.category || 'Mixed',
        description: building.description || 'Premium PG and residential lodging space.',
        startingPrice: building.startingPrice || 8500,
        securityDeposit: building.securityDeposit || 0,
        maintenanceCharges: building.maintenanceCharges || 799,
        foodCharges: building.foodCharges || 3000,
        genderType: building.genderType || 'Mixed',
        amenities: building.amenities && building.amenities.length > 0 ? building.amenities : ['Wifi', 'AC', 'Gym', 'Laundry'],
        images: building.images && building.images.length > 0 ? building.images : ['https://images.unsplash.com/photo-1555854817-5b2260d50c63?auto=format&fit=crop&q=80&w=800'],
        createdAt: building.createdAt || new Date(),
        policies: building.policies || { smoking: 'Not Allowed', alcohol: 'Not Allowed', pets: 'No', visitors: 'Till 8 PM' }
      },
      ownerDetails,
      tenants: tenantsEnriched,
      staff: staffEnriched,
      analytics
    });

  } catch (error) {
    console.error('Error fetching building portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch building portfolio details', details: error.message });
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
  getPlatformStats
};
