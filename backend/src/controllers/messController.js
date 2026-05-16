const MessMenu = require('../models/MessMenu');
const MessAttendance = require('../models/MessAttendance');
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
        
        const mealSummary = updatedMeals.join(' | ');

        await notificationService.createNotification({
            moduleName: 'Mess',
            portalType: 'Tenant',
            category: 'Menu Update',
            title: `Mess Menu: ${day} Updated`,
            message: `The ${plan} plan menu for ${day} has been updated. ${mealSummary}`,
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
        
        // Find existing attendance or create new
        let attendance = await MessAttendance.findOne({ tenantId, buildingId, date });
        
        if (!attendance) {
            attendance = new MessAttendance({
                tenantId,
                buildingId,
                date,
                [meal]: status
            });
        } else {
            attendance[meal] = status;
        }
        
        await attendance.save();

        // Real-time notification for both Tenant (local update) and Owner (analytics)
        const updatePayload = {
            tenantId,
            buildingId,
            date,
            meal,
            status,
            attendance
        };
        socketService.emitToRoom(buildingId, 'attendanceUpdated', updatePayload);
        socketService.emitToOwner('attendanceUpdated', updatePayload);

        // Get tenant details for enriched Owner notification
        const notificationService = require('../utils/notificationService');
        const Tenant = require('../models/Tenant');
        const Building = require('../models/Building');
        
        const tenant = await Tenant.findById(tenantId);
        const building = await Building.findById(buildingId);
        
        const tenantName = tenant ? tenant.name : 'A resident';
        const roomNumber = (tenant && tenant.room) ? ` (Room ${tenant.room})` : '';
        const buildingName = building ? ` at ${building.name}` : '';

        // EXCLUSIVE Owner Notification
        await notificationService.createNotification({
            moduleName: 'Mess',
            portalType: 'Owner',
            category: 'Attendance',
            title: `Attendance ${status ? 'Confirmed' : 'Skipped'}`,
            message: `${tenantName}${roomNumber} has opted to ${status ? 'attend' : 'skip'} ${meal} on ${new Date(date).toLocaleDateString()}${buildingName}.`,
            priority: status ? 'Low' : 'Medium', // Medium priority for skipped meals to help with waste reduction
            type: 'info',
            buildingId,
            actionLink: `/owner/building/${buildingId}/notifications?category=Mess`
        });
        
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.markAllAttendance = async (req, res) => {
    try {
        const { buildingId, date, meal, tenantIds } = req.body;
        
        const operations = tenantIds.map(tId => ({
            updateOne: {
                filter: { tenantId: tId, date, buildingId },
                update: { $set: { [meal]: true } },
                upsert: true
            }
        }));

        await MessAttendance.bulkWrite(operations);
        const updated = await MessAttendance.find({ buildingId, date });

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
