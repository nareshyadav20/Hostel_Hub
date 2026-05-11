const SystemSettings = require('../models/SystemSettings');

exports.getSettings = async (req, res) => {
  try {
    const { buildingId } = req.query;
    if (!buildingId) {
      return res.status(400).json({ message: "buildingId is required" });
    }

    let settings = await SystemSettings.findOne({ buildingId, owner: req.user.id });
    if (!settings) {
      // Create default settings if none exist for this building/owner
      settings = await SystemSettings.create({ buildingId, owner: req.user.id });
    }
    
    const settingsObj = settings.toObject();
    
    // Deep defaults merge logic
    const result = {
      ...settingsObj,
      rentSettings: {
        defaultRent: { single: 8000, double: 6000, shared: 4500, ...(settingsObj.rentSettings?.defaultRent || {}) },
        allowedPaymentMethods: settingsObj.rentSettings?.allowedPaymentMethods || ['UPI', 'Cash'],
        ...(settingsObj.rentSettings || {})
      },
      notificationSettings: {
        notificationTemplates: { 
          rentDue: 'Dear {name}, your rent for {month} is due.', 
          paymentSuccess: 'Thank you {name}, payment of {amount} received.',
          ...(settingsObj.notificationSettings?.notificationTemplates || {}) 
        },
        ...(settingsObj.notificationSettings || {})
      },
      hygieneSettings: {
        hygieneChecklist: settingsObj.hygieneSettings?.hygieneChecklist || ['Rooms', 'Kitchen', 'Washrooms'],
        assignedCleaningStaff: settingsObj.hygieneSettings?.assignedCleaningStaff || [],
        ...(settingsObj.hygieneSettings || {})
      },
      roomConfig: {
        roomTypes: settingsObj.roomConfig?.roomTypes || ['Single', 'Shared', 'Dormitory'],
        bedTypes: settingsObj.roomConfig?.bedTypes || ['Normal', 'Bunk'],
        ...(settingsObj.roomConfig || {})
      },
      reportSettings: {
        reportTypes: settingsObj.reportSettings?.reportTypes || ['Financial', 'Occupancy', 'Inventory'],
        exportFormats: settingsObj.reportSettings?.exportFormats || ['PDF', 'Excel'],
        ...(settingsObj.reportSettings || {})
      },
      generalSettings: {
        hostelName: 'Hostel Hub',
        ownerName: 'Property Owner',
        ...(settingsObj.generalSettings || {})
      },
      roleAccess: {
        roles: settingsObj.roleAccess?.roles || ['Owner', 'Manager', 'Staff', 'Tenant'],
        permissions: {
          moduleAccess: settingsObj.roleAccess?.permissions?.moduleAccess || ['Inventory', 'Payments', 'Complaints'],
          viewAccess: true,
          editAccess: false,
          deleteAccess: false,
          approvalRights: false,
          ...(settingsObj.roleAccess?.permissions || {})
        },
        ...(settingsObj.roleAccess || {})
      },
      themeSettings: {
        mode: 'DARK',
        ...(settingsObj.themeSettings || {})
      }
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Get Settings Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { buildingId } = req.body;
    if (!buildingId) {
      return res.status(400).json({ message: "buildingId is required" });
    }
    const settings = await SystemSettings.findOneAndUpdate(
      { buildingId, owner: req.user.id }, 
      { ...req.body, owner: req.user.id }, 
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(settings);
  } catch (error) {
    console.error("Update Settings Error:", error);
    res.status(500).json({ message: error.message });
  }
};
