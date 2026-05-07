const OwnerProfile = require('../models/OwnerProfile');
const User = require('../models/User');

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
