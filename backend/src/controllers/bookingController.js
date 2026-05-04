const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

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

    const booking = new Booking({
      tenantId,
      buildingId,
      category,
      moveInDate: moveInDate || 'TBD',
      securityDeposit,
      onboardingFee,
      totalAmount,
      paymentMethod: method || 'UPI',
      status: 'Confirmed'
    });

    await booking.save();

    // Create a payment record for the booking
    const invoice = `BKG-${Date.now().toString().slice(-6)}`;
    const payment = new Payment({
      tenantId,
      buildingId,
      amount: totalAmount,
      type: 'Booking',
      method: method || 'UPI',
      category: category,
      status: 'Paid',
      invoice,
      month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    });

    await payment.save();

    res.status(201).json({ booking, payment });
  } catch (error) {
    console.error('Error creating booking:', error);
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

module.exports = { createBooking, getMyBookings, getAllBookings };
