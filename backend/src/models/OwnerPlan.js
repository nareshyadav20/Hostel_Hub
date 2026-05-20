const mongoose = require('mongoose');

const OwnerPlanSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    menu: [{ type: String }],
    active: { type: Boolean, default: true },
    color: { type: String },
    popular: { type: Boolean, default: false }
}, {
    timestamps: true,
    collection: 'owner_plans'
});

module.exports = mongoose.model('OwnerPlan', OwnerPlanSchema);
