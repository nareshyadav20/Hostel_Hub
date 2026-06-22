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
      status, lastStep, draftData, policies, staffInfo,
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
      rentSingle, rentDouble, rentTriple, rent4Sharing, rent5Sharing, rent6Sharing,
      totalRooms: totalRooms || 0,
      totalBeds: totalBeds || 0,
      genderType: genderType || 'Mixed',
      category: category || 'Student',
      rating: rating || 4.5,
      popularityLabel,
      policies: finalPolicies,
      staffInfo: finalStaffInfo,
      status: initialStatus === 'Pending Approval' ? 'Active' : initialStatus,
      approvalStatus: initialStatus === 'Pending Approval' ? 'approved' : 'pending',
      isApproved: initialStatus === 'Pending Approval' ? true : false,
      lastStep: lastStep || 1,
      draftData: finalDraftData,
      documents: finalDocuments,
      security, cctv, parking, powerBackup, mess, gym, library, laundry, housekeeping, medicalSupport,
      lift, wifi, diningHall, commonKitchen, studyHall, laundryRoom, fireSafety, emergencyExit,
      isAC,
      owner: req.user.id
    });

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
    const ownerIds = ['69f5d174bb94a186e2747924', '6a0ef3a802c53c64d99e42d4'];
    if (req.user && req.user.id && !ownerIds.includes(req.user.id)) {
      ownerIds.push(req.user.id);
    }
    const queryOwnerIds = ownerIds.flatMap(id => [id, new mongoose.Types.ObjectId(id)]);

    const query = isPlatformAdmin ? {} : { owner: { $in: queryOwnerIds } };

    if (req.query.status) {
      if (req.query.status === 'Active') {
        query.status = { $ne: 'Draft' };
      } else {
        query.status = req.query.status;
      }
    }

    const buildings = await Building.find(query)
      .select('-floors -draftData -gallery -description')
      .populate('owner', 'name phone email')
      .lean();

    const populatedBuildings = await Promise.all(buildings.map(async (building) => {
      const floors = await Floor.find({ building: building._id }).select('_id').lean();
      const floorIds = floors.map(f => f._id);

      const rooms = await Room.find({ floor: { $in: floorIds } }).populate('beds').lean();

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

    res.status(200).json(populatedBuildings);
  } catch (error) { res.status(500).json({ error: error.message }); }
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
          if (field.includes(',')) return field.split(',').map(s => s.trim());
          return [field];
        }
        return field || defaultValue;
      }
    };

    if (updateData.amenities) updateData.amenities = parseField(updateData.amenities, []);
    if (updateData.documents) updateData.documents = parseField(updateData.documents, []);
    if (updateData.policies) updateData.policies = parseField(updateData.policies, {});
    if (updateData.staffInfo) updateData.staffInfo = parseField(updateData.staffInfo, {});
    if (updateData.draftData) updateData.draftData = parseField(updateData.draftData, {});

    if (req.files && req.files.length > 0) {
      let finalImages = parseField(updateData.images, []);
      const uploadedImages = req.files.map(file => {
        const b64 = file.buffer.toString('base64');
        return `data:${file.mimetype};base64,${b64}`;
      });
      finalImages.push(...uploadedImages);
      updateData.images = finalImages;
    }

    if (updateData.status === 'Pending Approval' || updateData.status === 'Pending') {
      updateData.status = 'Active';
      updateData.approvalStatus = 'approved';
      updateData.isApproved = true;
      updateData.rejectionReason = null;
    }

    const building = await Building.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!building) return res.status(404).json({ error: 'Building not found' });
    res.status(200).json(building);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteBuilding = async (req, res) => {
  try {
    const isPlatformAdmin = req.user && req.user.role && ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role.toUpperCase());
    const ownerIds = ['69f5d174bb94a186e2747924', '6a0ef3a802c53c64d99e42d4'];
    if (req.user && req.user.id && !ownerIds.includes(req.user.id)) {
      ownerIds.push(req.user.id);
    }
    const queryOwnerIds = ownerIds.flatMap(id => [id, new mongoose.Types.ObjectId(id)]);

    const query = isPlatformAdmin ? { _id: req.params.id } : { _id: req.params.id, owner: { $in: queryOwnerIds } };

    const building = await Building.findOne(query);
    if (!building) return res.status(404).json({ error: 'Building not found or unauthorized' });

    const floors = await Floor.find({ building: building._id }).select('_id').lean();
    const floorIds = floors.map(f => f._id);
    
    const rooms = await Room.find({ floor: { $in: floorIds } }).select('_id').lean();
    const roomIds = rooms.map(r => r._id);

    if (roomIds.length > 0) await Bed.deleteMany({ room: { $in: roomIds } });
    if (floorIds.length > 0) await Room.deleteMany({ floor: { $in: floorIds } });
    await Floor.deleteMany({ building: building._id });
    await Building.deleteOne(query);

    res.status(200).json({ message: 'Building and associated entities deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getBuildingById = async (req, res) => {
  try {
    const isPlatformAdmin = req.user && req.user.role && ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role.toUpperCase());
    const ownerIds = ['69f5d174bb94a186e2747924', '6a0ef3a802c53c64d99e42d4'];
    if (req.user && req.user.id && !ownerIds.includes(req.user.id)) {
      ownerIds.push(req.user.id);
    }
    const queryOwnerIds = ownerIds.flatMap(id => [id, new mongoose.Types.ObjectId(id)]);

    const query = isPlatformAdmin ? { _id: req.params.id } : { _id: req.params.id, owner: { $in: queryOwnerIds } };

    const building = await Building.findOne(query).lean();
    if (!building) return res.status(404).json({ error: 'Building not found or unauthorized' });

    const floors = await Floor.find({ building: building._id }).lean();
    const floorIds = floors.map(f => f._id);

    const rooms = await Room.find({ floor: { $in: floorIds } }).populate('beds').lean();

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
    building.floors = floors;

    res.status(200).json(building);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getPublicBuildings = async (req, res) => {
  try {
    const publicQuery = {
      $or: [
        { approvalStatus: 'approved', isApproved: true },
        { status: 'Active', approvalStatus: { $in: [null, undefined] } }
      ]
    };

    const buildings = await Building.find(
      publicQuery,
      {
        name: 1, address: 1, locationCity: 1, locality: 1, category: 1, rating: 1,
        startingPrice: 1, rentSingle: 1, rentDouble: 1, rentTriple: 1, rent4Sharing: 1, rent5Sharing: 1, rent6Sharing: 1, genderType: 1, amenities: 1, isAC: 1, images: 1
      }
    ).lean();

    res.status(200).json(buildings);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getPublicBuildingById = async (req, res) => {
  try {
    const publicQuery = {
      $or: [
        { approvalStatus: 'approved', isApproved: true },
        { status: 'Active', approvalStatus: { $in: [null, undefined] } }
      ],
      _id: req.params.id
    };

    const building = await Building.findOne(publicQuery)
      .select('-draftData -staffInfo -owner -lastStep')
      .lean();

    if (!building) return res.status(404).json({ error: 'Building not found or not approved' });

    const floors = await Floor.find({ building: building._id })
      .select('floorNumber floorCategory description occupancyPercentage totalRooms totalBeds facilities rooms building')
      .lean();
    const floorIds = floors.map(f => f._id);

    const rooms = await Room.find({ floor: { $in: floorIds } })
      .select('roomNumber roomType capacity rentAmount isAC facilities amenities balcony washroomType windowCount status floor')
      .populate({ path: 'beds', select: 'bedNumber status currentTenant isLower price' })
      .lean();

    let totalRooms = 0, totalBeds = 0, occupiedBeds = 0;
    floors.forEach(f => {
      f.rooms = rooms.filter(r => r.floor.toString() === f._id.toString());
      totalRooms += f.rooms.length;
      f.rooms.forEach(room => {
        const beds = room.beds || [];
        totalBeds += beds.length;
        occupiedBeds += beds.filter(b => b.status === 'OCCUPIED' || b.status === 'Occupied').length;
      });
    });

    building.totalRooms = totalRooms;
    building.totalBeds = totalBeds;
    building.occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
    building.floors = floors;

    res.status(200).json(building);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const uploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No photos provided' });
    }
    const uploadedImages = req.files.map(file => {
      const b64 = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${b64}`;
    });
    
    if (req.body.buildingId) {
      const building = await Building.findById(req.body.buildingId);
      if (building) {
        building.images = [...(building.images || []), ...uploadedImages];
        await building.save();

        // Sync to BuildingPhoto collection
        const photoDocs = uploadedImages.map((url, i) => ({
          buildingId: building._id,
          photoUrl: url,
          isCover: i === 0 && (!building.images || building.images.length === uploadedImages.length)
        }));
        await BuildingPhoto.insertMany(photoDocs).catch(err => {
          console.warn('[DEBUG] BuildingPhoto sync warning:', err.message);
        });
      }
    }
    
    res.status(200).json({ photoUrls: uploadedImages });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getBuildingPortfolio = async (req, res) => {
  try {
    const ownerIds = ['69f5d174bb94a186e2747924', '6a0ef3a802c53c64d99e42d4'];
    if (req.user && req.user.id && !ownerIds.includes(req.user.id)) {
      ownerIds.push(req.user.id);
    }
    const queryOwnerIds = ownerIds.flatMap(id => [id, new mongoose.Types.ObjectId(id)]);

    const buildings = await Building.find({ owner: { $in: queryOwnerIds }, status: { $ne: 'Draft' } }).lean();

    const result = await Promise.all(buildings.map(async (b) => {
      const floors = await Floor.find({ building: b._id }).lean();
      const floorIds = floors.map(f => f._id);
      const rooms = await Room.find({ floor: { $in: floorIds } }).populate('beds').lean();
      
      let totalBeds = 0;
      let occupiedBeds = 0;
      rooms.forEach(r => {
        const beds = r.beds || [];
        totalBeds += beds.length;
        occupiedBeds += beds.filter(bed => bed.status === 'OCCUPIED' || bed.status === 'Occupied').length;
      });

      return {
        _id: b._id,
        name: b.name,
        address: b.address,
        locationCity: b.locationCity,
        totalRooms: rooms.length,
        totalBeds,
        occupancyPercentage: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
        occupiedBeds,
        vacantBeds: totalBeds - occupiedBeds,
        status: b.status,
        approvalStatus: b.approvalStatus,
        rating: b.rating
      };
    }));

    res.json(result);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getPlatformStats = async (req, res) => {
  try {
    const statsQuery = { status: { $ne: 'Draft' }, isApproved: true };

    const totalBuildings = await Building.countDocuments(statsQuery);
    const cities = await Building.distinct('locationCity', statsQuery);
    
    const buildings = await Building.find(statsQuery).select('rating genderType category locationCity').lean();

    res.json({
      totalBuildings,
      activeCities: cities.length,
      averageRating: buildings.reduce((acc, b) => acc + (b.rating || 0), 0) / (buildings.length || 1),
      buildingsByCity: cities.map(c => ({
        city: c,
        count: buildings.filter(b => b.locationCity === c).length
      })),
      buildingsByCategory: {
        Coliving: buildings.filter(b => b.category === 'Luxury' || b.genderType === 'Mixed').length,
        Student: buildings.filter(b => b.category === 'Student').length,
        Professional: buildings.filter(b => b.category === 'Professional').length
      }
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const bulkCreateBuildings = async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};

const seedBalanced = async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};

const getOwnerDrafts = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const queryOwnerIds = [ownerId, new mongoose.Types.ObjectId(ownerId)];
    const drafts = await Building.find({ owner: { $in: queryOwnerIds }, status: 'Draft' })
      .select('name address draftData createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .lean();
    res.status(200).json(drafts);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = {
  createBuilding,
  getBuildings,
  getOwnerDrafts,
  updateBuilding,
  deleteBuilding,
  bulkCreateBuildings,
  getBuildingById,
  getPublicBuildings,
  getPublicBuildingById,
  uploadPhotos,
  getBuildingPortfolio,
  getPlatformStats,
  seedBalanced
};
