const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Tenant = require('../models/Tenant');

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
      guestName,
      email,
      phone
    } = req.body;

    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

    let activeTenantId = tenantId;

    // If tenantId is not provided or not valid, try to find or create a tenant by email
    if (!activeTenantId || !isValidObjectId(activeTenantId)) {
      if (email) {
        let t = await Tenant.findOne({ email });
        if (!t) {
          t = new Tenant({
            name: guestName || 'Guest Tenant',
            email: email,
            phone: phone || 'N/A',
            emergencyContact: phone || 'N/A',
            buildingId: isValidObjectId(buildingId) ? buildingId : undefined,
            status: 'PENDING'
          });
          await t.save();
          console.log('✅ Created new Tenant for booking:', t._id);
        }
        activeTenantId = t._id;
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
      userId: guestName || 'guest'
    };

    if (isValidObjectId(activeTenantId)) bookingData.tenantId = activeTenantId;
    if (isValidObjectId(buildingId)) bookingData.buildingId = buildingId;

    const booking = new Booking(bookingData);
    await booking.save();
    console.log('✅ Booking created:', booking._id);

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

    if (isValidObjectId(activeTenantId)) paymentData.tenantId = activeTenantId;
    if (isValidObjectId(buildingId)) paymentData.buildingId = buildingId;

    const payment = new Payment(paymentData);
    await payment.save();
    console.log('✅ Payment created:', payment._id);

    res.status(201).json({ booking, payment });
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const { tenantId } = req.query;
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId is required' });
    }
    const bookings = await Booking.find({ tenantId }).populate('buildingId').sort({ bookingDate: -1 });
    res.status(200).json(bookings);
  } catch (error) {
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
