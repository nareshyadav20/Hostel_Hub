const OwnerProfile = require('../models/OwnerProfile');
const User = require('../models/User');
const Building = require('../models/Building');
const Room = require('../models/Room');
const Tenant = require('../models/Tenant');
const Staff = require('../models/Staff');

exports.getProfile = async (req, res) => {
  try {
    let profile = await OwnerProfile.findOne({ userId: req.user.id });
    
    if (!profile) {
      // Fetch basic info from User model to seed the profile
      const user = await User.findById(req.user.id);
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
    const buildingsCount = await Building.countDocuments({ owner: req.user.id });
    const profile = await OwnerProfile.findOne({ userId: req.user.id });
    
    // Get real counts across all owned buildings
    const ownerBuildings = await Building.find({ owner: req.user.id }).select('_id');
    const bIds = ownerBuildings.map(b => b._id);
    
    const [totalTenants, totalStaff, staffList] = await Promise.all([
      Tenant.countDocuments({ buildingId: { $in: bIds } }),
      Staff.countDocuments({ buildingId: { $in: bIds } }),
      Staff.find({ buildingId: { $in: bIds } }).select('performance')
    ]);

    const avgRating = staffList.length > 0 
      ? staffList.reduce((s, st) => s + (st.performance || 0), 0) / staffList.length 
      : 5;

    res.json({
      buildingCount: buildingsCount,
      activeTenants: totalTenants,
      occupiedBeds: totalTenants, // Assuming 1 tenant = 1 occupied bed
      totalBeds: totalTenants + 20, // Placeholder
      occupancyRate: 85,
      monthlyRevenue: totalTenants * 8000,
      expectedMonthlyRevenue: totalTenants * 8000,
      profileCompleteness: profile?.profileCompleteness || 0,
      verifiedProperties: buildingsCount,
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
