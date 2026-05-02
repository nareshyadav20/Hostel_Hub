const MessMenu = require('../models/MessMenu');

// Seed data if collection is empty
const seedMenu = async () => {
    const count = await MessMenu.countDocuments();
    if (count > 0) return;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const plans = ['basic', 'standard', 'premium'];
    
    const initialMenu = {
        Monday: { breakfast: 'Idli, Sambar', lunch: 'Rice, Dal, Veg Fry', dinner: 'Roti, Paneer Masala' },
        Tuesday: { breakfast: 'Poha, Jalebi', lunch: 'Rajma Chawal, Papad', dinner: 'Aloo Gobi, Roti' },
        Wednesday: { breakfast: 'Aloo Paratha', lunch: 'Veg Biryani, Raita', dinner: 'Chole Bhature' },
        Thursday: { breakfast: 'Upma, Chutney', lunch: 'Kadi Pakoda, Rice', dinner: 'Mushroom Peas' },
        Friday: { breakfast: 'Masala Dosa', lunch: 'Dal Makhani, Rice', dinner: 'Egg Curry' },
        Saturday: { breakfast: 'Puri Sabzi', lunch: 'Mix Veg, Roti', dinner: 'Veg Pulao' },
        Sunday: { breakfast: 'Chole Poori', lunch: 'Special Thali', dinner: 'Light Khichdi' }
    };

    const seeds = [];
    plans.forEach(plan => {
        days.forEach(day => {
            seeds.push({
                plan,
                day,
                ...initialMenu[day]
            });
        });
    });

    await MessMenu.insertMany(seeds);
    console.log('Mess Menu seeded successfully');
};

exports.getMenu = async (req, res) => {
    try {
        await seedMenu(); // Ensure data exists
        const menu = await MessMenu.find().sort({ plan: 1, day: 1 });
        res.json(menu);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateMenu = async (req, res) => {
    try {
        const { plan, day, breakfast, lunch, dinner } = req.body;
        const menu = await MessMenu.findOneAndUpdate(
            { plan, day },
            { breakfast, lunch, dinner },
            { new: true, upsert: true }
        );
        res.json(menu);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
