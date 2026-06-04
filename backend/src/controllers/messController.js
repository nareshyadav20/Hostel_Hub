const MessMenu = require('../models/MessMenu');
const MessAttendance = require('../models/MessAttendance');
const OwnerPlan = require('../models/OwnerPlan');
const Rating = require('../models/Rating');
const socketService = require('../utils/socketService');

const DEFAULT_MENU = {
    Monday: { breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' },
    Tuesday: { breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' },
    Wednesday: { breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' },
    Thursday: { breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' },
    Friday: { breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' },
    Saturday: { breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' },
    Sunday: { breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' }
};

const PLANS = ['basic', 'standard', 'premium'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

exports.getMenu = async (req, res) => {
    try {
        const { buildingId } = req.query;
        if (!buildingId) return res.status(400).json({ message: 'buildingId is required' });

        let menu = await MessMenu.find({ buildingId }).sort({ plan: 1, day: 1 });

        // If no menu exists for this building, seed it with defaults
        if (menu.length === 0) {
            const seeds = [];
            PLANS.forEach(plan => {
                DAYS.forEach(day => {
                    seeds.push({
                        plan,
                        day,
                        buildingId,
                        ...DEFAULT_MENU[day]
                    });
                });
            });
            await MessMenu.insertMany(seeds);
            menu = await MessMenu.find({ buildingId }).sort({ plan: 1, day: 1 });
        }

        res.json(menu);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateMenu = async (req, res) => {
    try {
        const { plan, day, breakfast, lunch, dinner, buildingId } = req.body;
        if (!buildingId) return res.status(400).json({ message: 'buildingId is required' });

        const menu = await MessMenu.findOneAndUpdate(
            { plan, day, buildingId },
            { breakfast, lunch, dinner },
            { new: true, upsert: true }
        );

        // Real-time synchronization
        socketService.emitUpdate(buildingId, 'menuUpdated', {
            menu,
            indicator: "Updated Just Now"
        });

        // Create notification for tenants
        const notificationService = require('../utils/notificationService');
        const updatedMeals = [];
        if (breakfast) updatedMeals.push(`Breakfast: ${breakfast}`);
        if (lunch) updatedMeals.push(`Lunch: ${lunch}`);
        if (dinner) updatedMeals.push(`Dinner: ${dinner}`);
        // Ensure we have a valid buildingId for the notification
        const finalBuildingId = buildingId || (tenant.buildingId?._id || tenant.buildingId);

        if (!finalBuildingId) {
            console.warn('⚠️ No buildingId found for attendance notification');
        }

        const mealSummary = updatedMeals.join(' | ');

        await notificationService.createNotification({
            moduleName: 'Mess',
            portalType: 'Tenant',
            category: 'Menu Update',
            title: `Mess Menu Updated`,
            message: `The menu for today has been updated. ${mealSummary}`,
            priority: 'Medium',
            type: 'info',
            buildingId,
            actionLink: '/mess'
        });

        res.json(menu);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const { buildingId, date } = req.query;
        const attendance = await MessAttendance.find({ buildingId, date });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        const { tenantId, buildingId, date, meal, status } = req.body;
        console.log('🍽️ ATTENDANCE_UPDATE_REQUEST:', { tenantId, buildingId, meal, status });
        
        const Tenant = require('../models/Tenant');
        const mongoose = require('mongoose');

        let finalBuildingId = buildingId;
        
        // Self-healing fallback: Resolve buildingId from Tenant profile if invalid/missing
        if (!finalBuildingId || !mongoose.Types.ObjectId.isValid(finalBuildingId)) {
            const tenantDoc = await Tenant.findById(tenantId);
            if (tenantDoc) {
                finalBuildingId = tenantDoc.buildingId?._id || tenantDoc.buildingId;
            }
        }

        if (!finalBuildingId || !mongoose.Types.ObjectId.isValid(finalBuildingId)) {
            return res.status(400).json({ message: 'buildingId is required and could not be resolved.' });
        }

        // Find existing attendance or create new (querying by unique constraint keys only)
        let attendance = await MessAttendance.findOne({ tenantId, date });
        const previousMealStatus = attendance ? (!!attendance[meal]) : false;
        
        if (!attendance) {
            attendance = new MessAttendance({
                tenantId,
                buildingId: finalBuildingId,
                date,
                [meal]: status
            });
        } else {
            attendance.buildingId = finalBuildingId; // Ensure buildingId is synced
            attendance[meal] = status;
        }
        
        await attendance.save();

        // Update rewards based on mess attendance change
        if (status !== previousMealStatus) {
            try {
                const Reward = require('../models/tenant/Reward');
                const User = require('../models/User');
                // dining = +10 pts, skip = +5 sustainability pts (reward for reducing food waste)
                const pointsToModify = status ? 10 : 5;
                let reward = await Reward.findOne({ tenant: tenantId });

                if (!reward) {
                    // Tenant model has no `user` field — resolve User by email
                    const tenantDoc = await Tenant.findById(tenantId);
                    if (tenantDoc) {
                        const userDoc = await User.findOne({ email: tenantDoc.email }).lean();
                        if (userDoc) {
                            reward = await Reward.create({
                                tenant: tenantId,
                                user: userDoc._id,
                                points: 100, // Welcome points
                                lifetimeEarned: 100
                            });
                            console.log(`🎁 [REWARDS] Created new Reward wallet for tenant ${tenantId} (user: ${userDoc._id})`);
                        } else {
                            console.error(`⚠️ [REWARDS] No User found with email ${tenantDoc.email} — cannot create Reward wallet.`);
                        }
                    } else {
                        console.error(`⚠️ [REWARDS] Tenant ${tenantId} not found — cannot create Reward wallet.`);
                    }
                }

                if (reward) {
                    reward.points = Math.max(0, reward.points + pointsToModify);
                    reward.lifetimeEarned += pointsToModify;
                    reward.history.push({
                        reason: status
                            ? `Mess attendance reward for ${meal} on ${date}`
                            : `Sustainability bonus for skipping ${meal} on ${date}`,
                        points: pointsToModify,
                        type: 'Earned'
                    });
                    await reward.save();
                    console.log(`🎁 [REWARDS] +${pointsToModify} pts for tenant ${tenantId} (${status ? 'dining' : 'skip'}). New balance: ${reward.points}`);
                }
            } catch (rewardErr) {
                console.error('⚠️ [REWARDS] Failed to update mess attendance rewards:', rewardErr.message);
            }
        }

        // Real-time notification for both Tenant (local update) and Owner (analytics)
        const updatePayload = {
            tenantId,
            buildingId: finalBuildingId,
            date,
            meal,
            status,
            attendance
        };
        socketService.emitToRoom(finalBuildingId, 'attendanceUpdated', updatePayload);
        socketService.emitToOwner('attendanceUpdated', updatePayload);

        console.log('🔍 [DB_PERSISTENCE] Fetching metadata for notification:', { tenantId, buildingId: finalBuildingId });
        const MessLog = require('../models/MessLog');
        const Building = require('../models/Building');
        const notificationService = require('../utils/notificationService');
        
        const tenant = await Tenant.findById(tenantId);

        // Save to permanent MessLog collection
        try {
            await MessLog.create({
                tenantId,
                buildingId: finalBuildingId,
                tenantName: tenant?.name || 'A Resident',
                roomNumber: tenant?.room || 'N/A',
                meal,
                status,
                date
            });
            console.log('✅ [DB_PERSISTENCE] MessLog entry saved.');
        } catch (logErr) {
            console.error('⚠️ [DB_PERSISTENCE] MessLog save failed but continuing:', logErr.message);
        }
        
        const building = finalBuildingId ? await Building.findById(finalBuildingId) : null;
        
        const tenantName = tenant ? tenant.name : 'A resident';
        const roomNumber = (tenant && tenant.room) ? ` (Room ${tenant.room})` : '';
        const buildingName = building ? ` at ${building.name}` : '';

        // EXCLUSIVE Owner Notification
        console.log('📝 [DB_PERSISTENCE] Calling notificationService.createNotification...');
        await notificationService.createNotification({
            moduleName: 'Mess',
            portalType: 'Owner',
            category: 'Attendance',
            title: `Attendance ${status ? 'Confirmed' : 'Skipped'}`,
            message: `${tenantName}${roomNumber} has opted to ${status ? 'attend' : 'skip'} ${meal} on ${new Date(date).toLocaleDateString()}${buildingName}.`,
            priority: status ? 'Low' : 'Medium',
            type: 'info',
            buildingId: finalBuildingId,
            actionLink: `/owner/building/${finalBuildingId}/notifications?category=Mess`
        });

        // Tenant Notification
        console.log('📝 [DB_PERSISTENCE] Calling notificationService.createNotification for Tenant...');
        await notificationService.createNotification({
            moduleName: 'Mess',
            portalType: 'Tenant',
            category: 'Attendance',
            title: `Dining Status: ${status ? 'Attending' : 'Skipping'}`,
            message: `You have successfully marked your presence as "${status ? 'Attending' : 'Skipping'}" for ${meal} today.`,
            priority: 'Low',
            type: status ? 'success' : 'info',
            buildingId: finalBuildingId,
            receiverId: tenantId,
            receiverRole: 'Tenant',
            actionLink: '/tenant/mess'
        });
        
        res.json(attendance);
    } catch (err) {
        console.error('🔥 [DB_PERSISTENCE] updateAttendance FAILED:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.markAllAttendance = async (req, res) => {
    try {
        const { buildingId, date, meal, tenantIds } = req.body;
        
        const previousAttendances = await MessAttendance.find({ tenantId: { $in: tenantIds }, date });
        const alreadyAttendingIds = new Set(
            previousAttendances.filter(a => a[meal] === true).map(a => a.tenantId.toString())
        );

        const operations = tenantIds.map(tId => ({
            updateOne: {
                filter: { tenantId: tId, date, buildingId },
                update: { $set: { [meal]: true } },
                upsert: true
            }
        }));

        await MessAttendance.bulkWrite(operations);
        const updated = await MessAttendance.find({ buildingId, date });

        // Reward newly confirmed tenants
        try {
            const Reward = require('../models/tenant/Reward');
            const Tenant = require('../models/Tenant');
            for (const tId of tenantIds) {
                if (!alreadyAttendingIds.has(tId.toString())) {
                    let reward = await Reward.findOne({ tenant: tId });
                    if (!reward) {
                        const tenantDoc = await Tenant.findById(tId);
                        if (tenantDoc) {
                            reward = await Reward.create({
                                tenant: tId,
                                user: tenantDoc.user || tId,
                                points: 100,
                                lifetimeEarned: 100
                            });
                        }
                    }
                    if (reward) {
                        reward.points += 10;
                        reward.lifetimeEarned += 10;
                        reward.history.push({
                            reason: `Mess attendance reward for ${meal} on ${date} (Marked by Staff)`,
                            points: 10,
                            type: 'Earned'
                        });
                        await reward.save();
                    }
                }
            }
        } catch (rewardErr) {
            console.error('⚠️ [REWARDS] Failed to reward tenants in markAllAttendance:', rewardErr.message);
        }

        // Real-time synchronization for the whole building
        socketService.emitToRoom(buildingId, 'attendanceUpdated', {
            date,
            meal,
            status: true,
            isBulk: true
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const DEFAULT_PLANS = [
  { 
    id: 'basic', 
    name: 'Basic Plan', 
    price: 500, 
    description: 'Simple meals with a fixed weekly menu for standard nourishment.',
    features: ['Simple Meals', 'Fixed Weekly Menu', 'Limited Variety', 'No Customization', 'Fixed Portion'], 
    menu: ['Steamed Rice', 'Arhar Dal', 'Seasonal Dry Veg', 'Phulka Roti', 'Pickle'],
    active: true, 
    color: '#94a3b8' 
  },
  { 
    id: 'standard', 
    name: 'Standard Plan', 
    price: 1000, 
    description: 'Improved meal quality with rotating weekly menu and limited customization.',
    features: ['Improved Meal Quality', 'Rotating Weekly Menu', 'Moderate Variety', 'Limited Customization', '1 Refill Allowed'], 
    menu: ['Jeera Rice / Pulao', 'Paneer / Egg Curry', 'Mixed Veg Fry', 'Roti / Paratha', 'Sweet Bowl'],
    active: true, 
    color: '#3b82f6' 
  },
  { 
    id: 'premium', 
    name: 'Premium Plan', 
    price: 1500, 
    description: 'High-quality meals with fully customizable menu and premium add-ons.',
    features: ['High-Quality Meals', 'Fully Customizable Menu', 'Rich Variety (Veg + Non-Veg)', 'Unlimited/Refill Option', 'Special Weekend Meals', 'Fruits, Juice, Dessert'], 
    menu: ['Basmati Pulao / Biryani', 'Daily Premium Gravy', 'Cold Drink / Juice', 'Live Paratha / Dosa', 'Premium Desserts'],
    active: true, 
    color: '#8b5cf6', 
    popular: true 
  }
];

exports.getPlans = async (req, res) => {
    try {
        let plans = await OwnerPlan.find({});
        if (plans.length === 0) {
            await OwnerPlan.insertMany(DEFAULT_PLANS);
            plans = await OwnerPlan.find({});
        }
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, features, menu, active, popular } = req.body;
        
        const updated = await OwnerPlan.findOneAndUpdate(
            { id },
            { name, price, description, features, menu, active, popular },
            { new: true }
        );
        
        if (!updated) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        
        // Notify all tenants about the plan change
        try {
            const Building = require('../models/Building');
            const notificationService = require('../utils/notificationService');
            const buildings = await Building.find({});
            
            for (const building of buildings) {
                await notificationService.createNotification({
                    moduleName: 'Mess',
                    portalType: 'Tenant',
                    category: 'Plan Update',
                    title: `Mess Plan Updated`,
                    message: `The "${name}" monthly fee is now ₹${price}. Features: ${features.slice(0, 3).join(', ')}...`,
                    priority: 'Medium',
                    type: 'info',
                    buildingId: building._id,
                    actionLink: '/mess'
                });
            }
            console.log('✅ [NOTIFICATIONS] Successfully notified all tenants about plan changes.');
        } catch (notifErr) {
            console.error('⚠️ [NOTIFICATIONS] Failed to dispatch plan update notifications:', notifErr.message);
        }
        
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.submitRating = async (req, res) => {
    try {
        const { rating, feedback } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
        }

        // JWT carries { id: User._id, email, role }
        // Look up the Tenant profile by email (always present in the token)
        const Tenant = require('../models/Tenant');
        const tenant = await Tenant.findOne({ email: req.user.email });

        if (!tenant) {
            return res.status(404).json({ message: 'Tenant profile not found for this account.' });
        }

        const buildingId = tenant.buildingId?._id || tenant.buildingId;
        if (!buildingId) {
            return res.status(400).json({ message: 'You must be assigned to a building before submitting a rating.' });
        }

        // Determine meal type based on current hour (IST-adjusted)
        const hour = new Date().getHours();
        let mealType = 'dinner';
        if (hour < 11) mealType = 'breakfast';
        else if (hour < 16) mealType = 'lunch';

        const newRating = new Rating({
            tenantId: tenant._id,
            buildingId,
            mealType,
            rating,
            feedback: feedback || ''
        });

        await newRating.save();

        // Notify owner about the new feedback
        try {
            const notificationService = require('../utils/notificationService');
            await notificationService.createNotification({
                moduleName: 'Mess',
                portalType: 'Owner',
                category: 'Feedback',
                title: `Meal Rated: ${rating}/5 Stars`,
                message: `${tenant.name} rated their last meal (${mealType}) as ${rating} star${rating > 1 ? 's' : ''}.${feedback ? ` Feedback: "${feedback}"` : ''}`,
                priority: rating <= 2 ? 'High' : 'Low',
                type: 'info',
                buildingId,
                actionLink: `/owner/building/${buildingId}/notifications`
            });
        } catch (notifErr) {
            console.warn('⚠️ [RATING] Notification failed but rating was saved:', notifErr.message);
        }

        res.status(201).json({ message: 'Rating submitted successfully', rating: newRating });
    } catch (err) {
        console.error('Error submitting rating:', err);
        res.status(500).json({ message: err.message });
    }
};
