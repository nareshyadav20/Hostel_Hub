const MessMenu = require('../models/MessMenu');
const MessAttendance = require('../models/MessAttendance');

const DEFAULT_MENU = {
    Monday: { breakfast: 'Idli, Sambar', lunch: 'Rice, Dal, Veg Fry', dinner: 'Roti, Paneer Masala' },
    Tuesday: { breakfast: 'Poha, Jalebi', lunch: 'Rajma Chawal, Papad', dinner: 'Aloo Gobi, Roti' },
    Wednesday: { breakfast: 'Aloo Paratha', lunch: 'Veg Biryani, Raita', dinner: 'Chole Bhature' },
    Thursday: { breakfast: 'Upma, Chutney', lunch: 'Kadi Pakoda, Rice', dinner: 'Mushroom Peas' },
    Friday: { breakfast: 'Masala Dosa', lunch: 'Dal Makhani, Rice', dinner: 'Egg Curry' },
    Saturday: { breakfast: 'Puri Sabzi', lunch: 'Mix Veg, Roti', dinner: 'Veg Pulao' },
    Sunday: { breakfast: 'Chole Poori', lunch: 'Special Thali', dinner: 'Light Khichdi' }
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
        res.json(menu);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const { buildingId, date } = req.query; // date format: YYYY-MM-DD
        if (!buildingId || !date) return res.status(400).json({ message: 'buildingId and date are required' });

        const attendance = await MessAttendance.find({ buildingId, date });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        const { tenantId, buildingId, date, meal, status } = req.body;
        
        const update = { [meal]: status };
        
        const attendance = await MessAttendance.findOneAndUpdate(
            { tenantId, date, buildingId },
            { $set: update },
            { new: true, upsert: true }
        );
        
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
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
