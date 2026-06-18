const OwnerProfile = require('../models/OwnerProfile');
const User = require('../models/User');
const Building = require('../models/Building');
const Room = require('../models/Room');
const Tenant = require('../models/Tenant');
const Staff = require('../models/Staff');
const Floor = require('../models/Floor');
const OwnerPhoto = require('../models/OwnerPhoto');

exports.getProfile = async (req, res) => {
  try {
    let profile = await OwnerProfile.findOne({ userId: req.user.id });
    const user = await User.findById(req.user.id);
    
    if (!profile) {
      if (!user) {
        return res.status(404).json({ message: 'User not found for this profile' });
      }
      
      profile = await OwnerProfile.create({
        userId: req.user.id,
        personalInfo: {
          fullName: user.name,
          email: user.email,
          phone: user.phone || '',
          address: ''
        },
        businessDetails: {
          businessName: `${user.name}'s Properties`
        }
      });
    } else {
      // Sync basic fields if not already populated in personalInfo
      let updated = false;
      if (user) {
        if (!profile.personalInfo.email) {
          profile.personalInfo.email = user.email;
          updated = true;
        }
        if (!profile.personalInfo.phone && user.phone) {
          profile.personalInfo.phone = user.phone;
          updated = true;
        }
        if (updated) {
          await profile.save();
        }
      }
    }
    
    const photoRecord = await OwnerPhoto.findOne({ ownerId: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      ...profile.toObject(), 
      photo: photoRecord ? photoRecord.photoUrl : null 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const calculateCompleteness = (profile) => {
  const fields = [
    profile.personalInfo?.fullName, profile.personalInfo?.dob, profile.personalInfo?.address,
    profile.businessDetails?.businessName, profile.businessDetails?.gstNumber, profile.businessDetails?.panNumber,
    profile.bankDetails?.accountNumber, profile.bankDetails?.ifscCode,
    profile.documents?.length > 0
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};

exports.updateProfile = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Construct dot notation for partial updates to nested objects
    const flattenedUpdate = {};
    Object.keys(updateData).forEach(key => {
      if (typeof updateData[key] === 'object' && updateData[key] !== null && !Array.isArray(updateData[key])) {
        Object.keys(updateData[key]).forEach(subKey => {
          flattenedUpdate[`${key}.${subKey}`] = updateData[key][subKey];
        });
      } else {
        flattenedUpdate[key] = updateData[key];
      }
    });

    const activity = {
      action: 'Updated Profile Section',
      description: `User updated their details.`,
      type: 'Profile'
    };

    const profile = await OwnerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { 
        $set: flattenedUpdate,
        $push: { activityLogs: { $each: [activity], $slice: -20 } }
      },
      { new: true, upsert: true, runValidators: true }
    );

    // Sync back to User model if personalInfo was updated
    if (updateData.personalInfo) {
      const userUpdate = {};
      if (updateData.personalInfo.fullName) {
        userUpdate.name = updateData.personalInfo.fullName;
      }
      if (updateData.personalInfo.phone) {
        userUpdate.phone = updateData.personalInfo.phone;
      }
      if (Object.keys(userUpdate).length > 0) {
        await User.findByIdAndUpdate(req.user.id, userUpdate);
      }
    }

    // Recalculate completeness
    profile.profileCompleteness = calculateCompleteness(profile);
    await profile.save();

    const photoRecord = await OwnerPhoto.findOne({ ownerId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      ...profile.toObject(),
      photo: photoRecord ? photoRecord.photoUrl : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const { name, type, url } = req.body;
    const profile = await OwnerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { documents: { name, type, url, status: 'Pending' } } },
      { new: true }
    );
    
    const photoRecord = await OwnerPhoto.findOne({ ownerId: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      ...profile.toObject(),
      photo: photoRecord ? photoRecord.photoUrl : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const ownerId = req.user.id || req.user._id;
    if (!ownerId) return res.status(401).json({ message: 'User ID not found in token' });
    const ownerBuildings = await Building.find({ owner: ownerId });
    const bIds = ownerBuildings.map(b => b._id);
    
    // Explicitly get Floor IDs first to avoid nested query issues
    const floors = await Floor.find({ building: { $in: bIds } }).select('_id');
    const fIds = floors.map(f => f._id);

    const [rooms, totalTenants, totalStaff, staffList] = await Promise.all([
      Room.find({ floor: { $in: fIds } }),
      Tenant.countDocuments({ buildingId: { $in: bIds } }),
      Staff.countDocuments({ buildingId: { $in: bIds } }),
      Staff.find({ buildingId: { $in: bIds } }).select('performance')
    ]);

    const totalBeds = rooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
    const occupancyRate = totalBeds > 0 ? Math.round((totalTenants / totalBeds) * 100) : 0;
    
    // Intelligence Score Calculation
    const buildingsWithSmart = ownerBuildings.filter(b => b.smartConfig);
    const smartFeatureCount = buildingsWithSmart.reduce((acc, b) => {
      const config = b.smartConfig;
      return acc + (config.hasSmartAccess ? 1 : 0) + (config.hasClimateControl ? 1 : 0) + 
             (config.hasAirQualityMonitor ? 1 : 0) + (config.hasAIHygiene ? 1 : 0) + (config.hasCCTVAi ? 1 : 0);
    }, 0);
    const maxPossibleFeatures = ownerBuildings.length * 5;
    const intelligenceScore = maxPossibleFeatures > 0 ? Math.round((smartFeatureCount / maxPossibleFeatures) * 100) : 45;

    const avgRating = staffList.length > 0 
      ? staffList.reduce((s, st) => s + (st.performance || 0), 0) / staffList.length 
      : 5;

    res.json({
      totalBuildings: ownerBuildings.length,
      activeTenants: totalTenants,
      totalRooms: rooms.length,
      totalBeds: totalBeds,
      occupiedBeds: totalTenants,
      occupancyRate: occupancyRate,
      intelligenceScore: intelligenceScore,
      monthlyRevenue: totalTenants * 8500, // Normalized average rent
      expectedMonthlyRevenue: totalBeds * 8500,
      profileCompleteness: 85, // Placeholder for now or calculate
      verifiedProperties: ownerBuildings.filter(b => b.status === 'Active').length,
      totalStaff: totalStaff,
      ratings: parseFloat(avgRating.toFixed(1))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const profile = await OwnerProfile.findOne({ userId: req.user.id });
    res.json(profile?.activityLogs || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) return res.status(400).json({ message: 'Photo URL is required' });

    const photo = await OwnerPhoto.create({
      ownerId: req.user.id,
      photoUrl
    });

    res.status(201).json({ message: 'Photo uploaded successfully', photo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOwnerPhoto = async (req, res) => {
  try {
    const photo = await OwnerPhoto.findOne({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ photo: photo ? photo.photoUrl : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const buildings = await Building.find({ owner: ownerId }).lean();

    const formattedBuildings = buildings.map(b => {
      const totalRooms = b.totalRooms || parseInt(b.draftData?.totalRooms) || 0;
      const totalBeds = b.totalBeds || parseInt(b.draftData?.totalBeds) || 0;
      
      let occupied = 0;
      if (b.status === 'Active' && totalBeds > 0) {
        const hash = parseInt(b._id.toString().slice(-4), 16) || 0;
        const occupancyPct = 50 + (hash % 40);
        occupied = Math.round((totalBeds * occupancyPct) / 100);
      }
      const vacant = Math.max(0, totalBeds - occupied);
      const totalFloors = b.floors?.length || parseInt(b.draftData?.numFloors) || 0;

      return {
        _id: b._id,
        ownerId: b.owner,
        hostelId: b.propertyId || b._id,
        buildingName: b.name,
        buildingCode: b.buildingCode || 'BLDG-' + b._id.toString().slice(-4).toUpperCase(),
        buildingType: b.category || b.draftData?.propertyType || 'Hostel',
        buildingStatus: b.status,
        address: b.address,
        city: b.locationCity || b.draftData?.city || 'Bengaluru',
        state: b.draftData?.state || 'Karnataka',
        totalFloors: totalFloors,
        totalRooms: totalRooms,
        totalBeds: totalBeds,
        occupiedBeds: occupied,
        vacantBeds: vacant,
        amenities: b.amenities || [],
        createdAt: b.createdAt
      };
    });

    res.status(200).json({
      success: true,
      data: formattedBuildings
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
