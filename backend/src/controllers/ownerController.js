const OwnerProfile = require('../models/OwnerProfile');
const User = require('../models/User');
const Building = require('../models/Building');
const Room = require('../models/Room');
const Tenant = require('../models/Tenant');
const Staff = require('../models/Staff');
const Floor = require('../models/Floor');

exports.getProfile = async (req, res) => {
  try {
    let profile = await OwnerProfile.findOne({ userId: req.user.id });
    
    if (!profile) {
      // Fetch basic info from User model to seed the profile
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found for this profile' });
      }
      
      profile = await OwnerProfile.create({
        userId: req.user.id,
        personalInfo: {
          fullName: user.name,
          address: ''
        },
        businessDetails: {
          businessName: `${user.name}'s Properties`
        }
      });
    }
    
    res.status(200).json(profile);
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
    
    // Add activity log
    const section = Object.keys(updateData)[0]; // e.g. personalInfo
    const activity = {
      action: 'Updated Profile Section',
      description: `User updated their ${section} details.`,
      type: 'Profile'
    };

    const profile = await OwnerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { 
        $set: updateData,
        $push: { activityLogs: { $each: [activity], $slice: -20 } } // Keep last 20 logs
      },
      { new: true, upsert: true, runValidators: true }
    );

    // Recalculate completeness
    profile.profileCompleteness = calculateCompleteness(profile);
    await profile.save();

    res.status(200).json(profile);
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
    res.status(200).json(profile);
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
