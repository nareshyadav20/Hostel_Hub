const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  const { email, password, name, role, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ email, password, name, role, phone });

    // Automatically create a Tenant profile if the role is TENANT
    if (role === 'TENANT') {
      const Tenant = require('../models/tenant/Tenant');
      await Tenant.create({
        name,
        email,
        phone,
        status: 'ACTIVE',
        user: user._id
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isPasswordCorrect = await require('bcryptjs').compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: 'Invalid email or password' });

    // For tenant users: ensure a Tenant profile exists and return it
    let tenantProfile = null;
    if (user.role === 'TENANT') {
      const Tenant = require('../models/Tenant');
      tenantProfile = await Tenant.findOne({ email: user.email });
      if (!tenantProfile) {
        // Auto-create a stub profile so the portal has something to show
        tenantProfile = await Tenant.create({
          name: user.name,
          email: user.email,
          phone: user.phone || 'N/A',
          emergencyContact: 'N/A',
          status: 'PENDING'
        });
      }
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ user, token, tenantProfile });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = { register, login };
