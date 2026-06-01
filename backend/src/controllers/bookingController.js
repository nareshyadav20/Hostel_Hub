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
      sharingType,
      bedId,
      roomId,
      guestName,
      email,
      phone
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
      // If already assigned and active in a building, block new booking
      if (tenant.buildingId && tenant.status === 'ACTIVE') {
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
      userId: tenantId || (req.user ? req.user.id : 'guest'),
      proofId: isValidObjectId(proofId) ? proofId : undefined,
      guestName,
      email,
      phone
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

    // Determine actual tenant ID for assignments
    const actualTenantId = tenant ? tenant._id : finalTenantId;

    // Record the bed filling and ACTUALLY allocate an AVAILABLE Bed document
    if (isValidObjectId(buildingId)) {
      const BedFilling = require('../models/BedFilling');
      const bedFill = new BedFilling({
        buildingId,
        tenantId: actualTenantId,
        category: category || 'Standard',
        sharingType: sharingType,
        bedNumber: bedNumber,
        status: 'Occupied'
      });
      await bedFill.save();

      // Find an AVAILABLE bed in the building and allocate it
      const Floor = require('../models/Floor');
      const Room = require('../models/Room');
      const Bed = require('../models/Bed');
      const Building = require('../models/Building');

      let availableBed = null;
      if (isValidObjectId(bedId)) {
        availableBed = await Bed.findOne({ _id: bedId, status: 'AVAILABLE' });
        if (!availableBed) {
           return res.status(409).json({ error: 'Conflict: The selected bed is already occupied or unavailable.' });
        }
      } else {
        // Fallback for legacy flows
        const floors = await Floor.find({ building: buildingId }).select('_id');
        const fIds = floors.map(f => f._id);
        const roomsPref = await Room.find({ floor: { $in: fIds }, capacity: sharingType }).select('_id');
        let rIds = roomsPref.map(r => r._id);
        availableBed = await Bed.findOne({ room: { $in: rIds }, status: 'AVAILABLE' });
        if (!availableBed) {
          const roomsAll = await Room.find({ floor: { $in: fIds } }).select('_id');
          rIds = roomsAll.map(r => r._id);
          availableBed = await Bed.findOne({ room: { $in: rIds }, status: 'AVAILABLE' });
        }
      }

      if (availableBed) {
        availableBed.status = 'OCCUPIED';
        availableBed.tenant = actualTenantId;
        await availableBed.save();
        console.log('✅ Bed explicitly allocated:', availableBed._id);
        
        // Bottom-up occupancy recalculation (Phase 8)
        if (availableBed.room || roomId) {
           const targetRoomId = availableBed.room || roomId;
           const roomBeds = await Bed.find({ room: targetRoomId });
           const occBeds = roomBeds.filter(b => b.status === 'OCCUPIED').length;
           await Room.findByIdAndUpdate(targetRoomId, { occupiedBeds: occBeds });
           
           const roomObj = await Room.findById(targetRoomId);
           if (roomObj && roomObj.floor) {
              const floorRooms = await Room.find({ floor: roomObj.floor });
              let floorOccBeds = 0;
              let floorTotalBeds = 0;
              for (const r of floorRooms) {
                 const rBeds = await Bed.find({ room: r._id });
                 floorTotalBeds += rBeds.length;
                 floorOccBeds += rBeds.filter(b => b.status === 'OCCUPIED').length;
              }
              const occPct = floorTotalBeds > 0 ? Math.round((floorOccBeds / floorTotalBeds) * 100) : 0;
              await Floor.findByIdAndUpdate(roomObj.floor, { occupancyPercentage: occPct });
           }
        }
      } else {
        console.warn('⚠️ No physical Bed document was AVAILABLE to allocate in building', buildingId);
      }

      // Auto-sync the hostel occupancy for the owner
      try {
        const building = await Building.findById(buildingId).select('owner');
        if (building && building.owner) {
          const Hostel = require('../models/Hostel');
          const hostel = await Hostel.findOne({ owner: building.owner });
          if (hostel) {
            const ownerBuildings = await Building.find({ owner: building.owner }).select('_id totalBeds');
            const bIds = ownerBuildings.map(b => b._id);
            const configuredTotal = ownerBuildings.reduce((sum, b) => sum + (b.totalBeds || 0), 0);
            
            const fs = await Floor.find({ building: { $in: bIds } }).select('_id');
            const rs = await Room.find({ floor: { $in: fs.map(f => f._id) } }).select('_id');
            const roomIds = rs.map(r => r._id);
            const occupiedPhysical = await Bed.countDocuments({ room: { $in: roomIds }, status: 'OCCUPIED' });
            
            const BedFillingModel = require('../models/BedFilling');
            const occupiedVirtual = await BedFillingModel.countDocuments({ buildingId: { $in: bIds }, status: 'Occupied' });
            
            const occupiedCount = Math.max(occupiedPhysical, occupiedVirtual);
            
            let totalB = await Bed.countDocuments({ room: { $in: roomIds } });
            if (hostel.totalBeds > 0) totalB = hostel.totalBeds;
            else if (configuredTotal > 0) totalB = configuredTotal;
            
            hostel.filledBeds = Math.min(occupiedCount, totalB);
            await hostel.save();
            console.log('✅ Owner Hostel occupancy synced:', hostel.filledBeds, '/', totalB);
          }
        }
      } catch (syncErr) {
        console.warn('⚠️ Post-booking occupancy sync failed:', syncErr.message);
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

    // CRITICAL: Link payment to the ACTUAL Tenant Profile ID, not the User ID
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
    const Building = require('../models/Building');

    // Find the unique Tenant profile for this email
    const tenant = await Tenant.findOne({ email });
    if (!tenant) {
      console.log(`[DEBUG] No Tenant profile found for email ${email}`);
      return res.status(200).json([]);
    }

    console.log(`[DEBUG] Searching bookings for tenant ID: ${tenant._id}`);

    // Find bookings strictly belonging to this tenant profile
    let bookings = await Booking.find({ 
      tenantId: tenant._id 
    }).populate('buildingId').sort({ bookingDate: -1 });

    // If no formal booking found, also search by userId (legacy records)
    if (bookings.length === 0) {
      bookings = await Booking.find({ 
        userId: userIdFromToken 
      }).populate('buildingId').sort({ bookingDate: -1 });
      console.log(`[DEBUG] Fallback userId search found ${bookings.length} bookings`);
    }

    // If STILL no bookings but the tenant has an active residency, synthesize one
    // This handles cases where the Booking doc was lost/misplaced but the tenant profile is active
    if (bookings.length === 0 && tenant.buildingId && tenant.status === 'ACTIVE') {
      console.log(`[DEBUG] No booking docs found, but tenant has active residency at ${tenant.buildingId}. Synthesizing booking.`);
      
      const building = await Building.findById(tenant.buildingId);
      
      // Create a synthetic booking object that matches the Booking schema shape
      const syntheticBooking = {
        _id: `synth_${tenant._id}`,
        tenantId: tenant._id,
        buildingId: building || { _id: tenant.buildingId, name: 'Your Hostel' },
        category: tenant.occupation || 'Standard',
        moveInDate: tenant.checkInDate || tenant.createdAt || 'TBD',
        securityDeposit: 0,
        onboardingFee: 0,
        totalAmount: tenant.rent || 0,
        status: 'Confirmed',
        paymentMethod: 'UPI',
        bookingDate: tenant.checkInDate || tenant.createdAt,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt
      };
      
      bookings = [syntheticBooking];
      console.log(`[DEBUG] Synthesized 1 booking from active tenant profile`);
    }

    console.log(`[DEBUG] Returning ${bookings.length} bookings for tenant ${tenant._id}`);
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
