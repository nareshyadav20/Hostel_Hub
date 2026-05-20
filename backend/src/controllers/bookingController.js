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
      method,
      proofId,
      bedNumber,
      sharingType
    } = req.body;

    // Validate ObjectIds — helper function
    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

    let tenant = null;
    const Tenant = require('../models/Tenant');
    const User = require('../models/User');

    // Resolve tenant profile
    if (isValidObjectId(tenantId)) {
      tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        const user = await User.findById(tenantId);
        if (user) tenant = await Tenant.findOne({ email: user.email });
      }
    } else if (req.user && req.user.email) {
      tenant = await Tenant.findOne({ email: req.user.email });
    }

    // 1. Prevent multiple bookings for same tenant
    if (tenant) {
      // If already assigned to a building, block new booking
      if (tenant.buildingId) {
        return res.status(400).json({ 
          error: 'Access Denied: You already have an active residency or booking. A resident can only book one hostel at a time.' 
        });
      }

      // Check if they already have a confirmed booking
      const existingBooking = await Booking.findOne({ tenantId: tenant._id, status: 'Confirmed' });
      if (existingBooking) {
        return res.status(400).json({ 
          error: 'Booking limit reached: You already have a confirmed reservation. Please manage your existing stay in the dashboard.' 
        });
      }
    }

    const finalTenantId = tenant ? tenant._id : (isValidObjectId(tenantId) ? tenantId : undefined);

    const bookingData = {
      category: category || 'Standard',
      moveInDate: moveInDate || 'TBD',
      securityDeposit: securityDeposit || 0,
      onboardingFee: onboardingFee || 0,
      totalAmount: totalAmount || 0,
      paymentMethod: method || 'UPI',
      status: 'Confirmed',
      userId: req.user.id || tenantId || 'guest',
      proofId: isValidObjectId(proofId) ? proofId : undefined
    };

    if (finalTenantId) bookingData.tenantId = finalTenantId;
    if (isValidObjectId(buildingId)) bookingData.buildingId = buildingId;

    const booking = new Booking(bookingData);
    await booking.save();
    console.log('✅ Booking created:', booking._id);

    // If proofId was provided, backlink the proof to this booking
    if (isValidObjectId(proofId)) {
      const TenantProof = require('../models/TenantProof');
      await TenantProof.findByIdAndUpdate(proofId, { bookingId: booking._id });
      console.log('✅ TenantProof linked to booking');
    }

    // Update Tenant profile automatically so dashboard reflects changes
    if (tenant) {
      await Tenant.findByIdAndUpdate(tenant._id, {
        buildingId: buildingId,
        status: 'ACTIVE',
        room: 'TBD (Assigning)',
        occupation: category,
        rent: totalAmount / 2,
        rentStatus: 'PAID',
        lastPayment: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      });
      console.log('✅ Tenant profile updated with booking info');
    } else {
      console.warn('⚠️ Could not find Tenant profile to update');
    }

    // Record the bed filling if bed data is provided
    if (isValidObjectId(buildingId) && bedNumber && sharingType) {
      const BedFilling = require('../models/BedFilling');
      const bedFill = new BedFilling({
        buildingId,
        tenantId: tenant ? tenant._id : finalTenantId,
        category: category || 'Standard',
        sharingType: sharingType,
        bedNumber: bedNumber,
        status: 'Occupied'
      });
      await bedFill.save();
      console.log('✅ Bed filling recorded for bed:', bedNumber, 'sharing:', sharingType);
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

    // CRITICAL: Link payment to the ACTUAL Tenant Profile ID, not the User ID
    const actualTenantId = tenant ? tenant._id : finalTenantId;
    if (isValidObjectId(actualTenantId)) paymentData.tenantId = actualTenantId;
    if (isValidObjectId(buildingId)) paymentData.buildingId = buildingId;

    const payment = new Payment(paymentData);
    await payment.save();
    console.log('✅ Payment created:', payment._id);

    // Populate for real-time update
    const populatedPayment = await Payment.findById(payment._id).populate('tenantId');

    // Real-time synchronization
    // Emit booking created to owner portal
    socketService.emitUpdate(null, 'bookingCreated', { booking, payment: populatedPayment });
    
    // Emit payment completed
    socketService.emitUpdate(buildingId, 'paymentCompleted', populatedPayment);
    
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
    const email = req.user.email;
    const userIdFromToken = req.user.id;
    
    console.log(`[DEBUG] getMyBookings for user: ${email} (ID: ${userIdFromToken})`);

    const Tenant = require('../models/Tenant');

    // Find the unique Tenant profile for this email
    const tenant = await Tenant.findOne({ email });
    if (!tenant) {
      console.log(`[DEBUG] No Tenant profile found for email ${email}`);
      return res.status(200).json([]);
    }

    console.log(`[DEBUG] Searching bookings for tenant ID: ${tenant._id}`);

    // Find bookings strictly belonging to this tenant profile
    const bookings = await Booking.find({ 
      tenantId: tenant._id 
    }).populate('buildingId').sort({ bookingDate: -1 });

    console.log(`[DEBUG] Found ${bookings.length} bookings for tenant ${tenant._id}`);
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

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('tenantId buildingId');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus };
