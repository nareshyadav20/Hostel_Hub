const Complaint = require('../models/tenant/Complaint');
const { getOrCreateTenant } = require('../utils/tenantHelper');

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const tenant = await getOrCreateTenant(req.user);
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });

    const complaint = await Complaint.create({
      title,
      description,
      category,
      tenant: tenant._id,
      user: req.user.id
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create complaint', error: error.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update complaint', error: error.message });
  }
};
