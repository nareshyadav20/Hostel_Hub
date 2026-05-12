const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const socketService = require('../utils/socketService');

const createBooking = async (req, res) => {
  try {
    const { 
      tenantId, 
      buildingId, 
      category, 
      moveInDate, 
      securityDeposit, 
      onboardingFee, 
      totalAmount, 
      method 
    } = req.body;

    // Validate ObjectIds — helper function
    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

    // 1. Prevent multiple bookings for same tenant
    if (isValidObjectId(tenantId)) {
      const Tenant = require('../models/Tenant');
      const existingTenant = await Tenant.findById(tenantId);
      
      // If already assigned to a building, block new booking
      if (existingTenant && existingTenant.buildingId) {
        return res.status(400).json({ 
          error: 'Access Denied: You already have an active residency or booking. A resident can only book one hostel at a time.' 
        });
      }

      // Check if they already have a confirmed booking
      const existingBooking = await Booking.findOne({ tenantId, status: 'Confirmed' });
      if (existingBooking) {
        return res.status(400).json({ 
          error: 'Booking limit reached: You already have a confirmed reservation. Please manage your existing stay in the dashboard.' 
        });
      }
    }

    const bookingData = {
      category: category || 'Standard',
      moveInDate: moveInDate || 'TBD',
      securityDeposit: securityDeposit || 0,
      onboardingFee: onboardingFee || 0,
      totalAmount: totalAmount || 0,
      paymentMethod: method || 'UPI',
      status: 'Confirmed',
      userId: tenantId || 'guest'
    };

    if (isValidObjectId(tenantId)) bookingData.tenantId = tenantId;
    if (isValidObjectId(buildingId)) bookingData.buildingId = buildingId;

    const booking = new Booking(bookingData);
    await booking.save();
    console.log('✅ Booking created:', booking._id);

    // Update Tenant profile automatically so dashboard reflects changes
    if (isValidObjectId(tenantId)) {
      const Tenant = require('../models/Tenant');
      const User = require('../models/User');
      
      // Find the tenant profile (try direct ID match or via User email)
      let tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        const user = await User.findById(tenantId);
        if (user) tenant = await Tenant.findOne({ email: user.email });
      }

      if (tenant) {
        await Tenant.findByIdAndUpdate(tenant._id, {
          buildingId: buildingId,
          status: 'ACTIVE',
          room: 'TBD (Assigning)',
          occupation: category,
          rent: totalAmount / 2 
        });
        console.log('✅ Tenant profile updated with booking info');
      } else {
        console.warn('⚠️ Could not find Tenant profile to update');
      }
    }

    // Create a payment record for the booking
    const invoice = `BKG-${Date.now().toString().slice(-6)}`;
    const paymentData = {
      amount: totalAmount || 0,
      type: 'Booking',
      method: method || 'UPI',
      category: category || 'Standard',
      status: 'Paid',
      invoice,
      month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    };

    if (isValidObjectId(tenantId)) paymentData.tenantId = tenantId;
    if (isValidObjectId(buildingId)) paymentData.buildingId = buildingId;

    const payment = new Payment(paymentData);
    await payment.save();
    console.log('✅ Payment created:', payment._id);

    // Real-time synchronization
    // Emit booking created to owner portal
    socketService.emitUpdate(null, 'bookingCreated', { booking, payment });
    
    // Emit payment completed
    socketService.emitUpdate(buildingId, 'paymentCompleted', payment);
    
    // Emit bed status updated (since booking usually occupies a bed)
    socketService.emitUpdate(buildingId, 'bedStatusUpdated', { status: 'Occupied' });

    res.status(201).json({ booking, payment });
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const { tenantId } = req.query;
    console.log(`[DEBUG] getMyBookings requested for ID: ${tenantId}`);
    
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const Tenant = require('../models/Tenant');
    const User = require('../models/User');

    // 1. Find the email associated with the provided ID (could be Tenant ID or User ID)
    let email = null;
    const tenant = await Tenant.findById(tenantId);
    if (tenant) {
      email = tenant.email;
      console.log(`[DEBUG] ID matched Tenant. Email: ${email}`);
    } else {
      const user = await User.findById(tenantId);
      if (user) {
        email = user.email;
        console.log(`[DEBUG] ID matched User. Email: ${email}`);
      }
    }

    // 2. If no email found, fall back to direct ID search
    if (!email) {
      console.log(`[DEBUG] No email found for ID ${tenantId}. Performing direct search.`);
      const bookings = await Booking.find({ tenantId }).populate('buildingId').sort({ bookingDate: -1 });
      return res.status(200).json(bookings);
    }

    // 3. Find all possible IDs (Tenant & User) for this email to ensure we catch all bookings
    const [relatedTenants, relatedUsers] = await Promise.all([
      Tenant.find({ email }).select('_id'),
      User.find({ email }).select('_id')
    ]);

    const allAssociatedIds = [
      ...relatedTenants.map(t => t._id),
      ...relatedUsers.map(u => u._id)
    ];
    console.log(`[DEBUG] Associated IDs for ${email}:`, allAssociatedIds);

    // 4. Find bookings linked to any of these IDs
    const bookings = await Booking.find({ 
      tenantId: { $in: allAssociatedIds } 
    }).populate('buildingId').sort({ bookingDate: -1 });

    console.log(`[DEBUG] Found ${bookings.length} bookings for account ${email}`);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('[ERROR] getMyBookings failed:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('tenantId buildingId').sort({ bookingDate: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings };
